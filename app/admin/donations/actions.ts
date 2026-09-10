"use server";

import { createClient } from "@/lib/supabase/server";

const MANUAL_METHODS = ["manual_bank", "qris_manual"];

export async function verifyManualDonation(donationId: string) {
  const supabase = await createClient();

  // ── GUARD 1: Admin check (server-side, double-check) ──────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi tidak valid. Silakan login ulang." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, error: "Hanya admin yang dapat melakukan verifikasi." };
  }

  // ── GUARD 2: Fetch donation + check payment_method ────────────────
  const { data: donation, error: fetchError } = await supabase
    .from("donations")
    .select("id, payment_method, status, amount, campaign_id, donor_name")
    .eq("id", donationId)
    .single();

  if (fetchError || !donation) {
    return { success: false, error: "Donasi tidak ditemukan." };
  }

  // CRITICAL: Reject Midtrans donations — this action MUST NOT touch them
  if (donation.payment_method === "midtrans") {
    return {
      success: false,
      error:
        "Donasi ini menggunakan Midtrans. Status hanya dapat diubah oleh webhook pembayaran terverifikasi.",
    };
  }

  // Also reject if there's a payment record (meaning this went through Midtrans gateway)
  const { count: paymentCount } = await supabase
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("donation_id", donationId);

  if (paymentCount && paymentCount > 0) {
    return {
      success: false,
      error:
        "Donasi ini memiliki riwayat transaksi payment gateway. Verifikasi manual tidak diperbolehkan.",
    };
  }

  // Reject if payment_method is not in the allowed manual list
  if (!MANUAL_METHODS.includes(donation.payment_method || "")) {
    return {
      success: false,
      error: `Metode pembayaran "${donation.payment_method}" tidak dapat diverifikasi secara manual.`,
    };
  }

  // ── GUARD 3: Status must be pending ───────────────────────────────
  if (donation.status !== "pending") {
    return {
      success: false,
      error: `Donasi sudah berstatus "${donation.status}" dan tidak dapat diverifikasi ulang.`,
    };
  }

  // ── CHECK: Prevent duplicate ledger entry (idempotency) ───────────
  const { data: existingLedger } = await supabase
    .from("financial_transactions")
    .select("id")
    .eq("donation_id", donationId)
    .eq("type", "income")
    .maybeSingle();

  if (existingLedger) {
    return {
      success: false,
      error: "Donasi ini sudah pernah dicatat di buku kas.",
    };
  }

  // ── ALL GUARDS PASSED — Execute updates ───────────────────────────
  const now = new Date().toISOString();

  // 1. Update donation status to success
  const { error: updateError } = await supabase
    .from("donations")
    .update({ status: "success", updated_at: now })
    .eq("id", donationId);

  if (updateError) {
    console.error("Failed to update donation status:", updateError);
    return { success: false, error: "Gagal memperbarui status donasi." };
  }

  // 2. Insert financial transaction (ledger entry) — mirrors webhook pattern
  const { error: ledgerError } = await supabase
    .from("financial_transactions")
    .insert({
      donation_id: donationId,
      campaign_id: donation.campaign_id,
      type: "income",
      amount: donation.amount,
      source: "manual_verified",
      reference: `Verified by ${profile.name || user.email} at ${now}`,
      description: `Donasi sukses via verifikasi manual — ${donation.donor_name}`,
    });

  if (ledgerError) {
    console.error("Failed to insert ledger entry:", ledgerError);
    // Rollback donation status
    await supabase
      .from("donations")
      .update({ status: "pending", updated_at: now })
      .eq("id", donationId);
    return { success: false, error: "Gagal mencatat transaksi ke buku kas." };
  }

  // 3. Atomic increment campaign amount — REUSES the same RPC as webhook
  const { error: rpcError } = await supabase.rpc("increment_campaign_amount", {
    p_campaign_id: donation.campaign_id,
    p_amount: donation.amount,
  });

  if (rpcError) {
    console.error("Failed to increment campaign amount:", rpcError);
    // Note: donation status is already 'success' and ledger is recorded.
    // Campaign amount inconsistency is a lesser failure — log for manual fix.
  }

  // 4. Insert audit trail entry
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "verify_manual_donation",
    entity_type: "donation",
    entity_id: donationId,
    metadata: {
      amount: donation.amount,
      campaign_id: donation.campaign_id,
      donor_name: donation.donor_name,
      payment_method: donation.payment_method,
      verified_at: now,
    },
  });

  return { success: true };
}
