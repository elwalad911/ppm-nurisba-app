"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { donationSchema, type DonationInput } from "@/lib/validations/donation";

type PaymentMethodChoice = "midtrans" | "manual_bank" | "qris_manual";

export async function createPendingDonation(input: DonationInput) {
  const result = donationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const data = result.data;

  // Anon key client for donations insert (has RLS INSERT policy)
  const supabase = await createClient();

  // Insert donation with status 'pending'
  const { data: donation, error } = await supabase
    .from("donations")
    .insert({
      campaign_id: data.campaign_id,
      donor_name: data.is_anonymous ? "Hamba Allah" : data.donor_name,
      donor_email: data.donor_email || null,
      donor_phone: data.donor_phone || null,
      is_anonymous: data.is_anonymous,
      amount: data.amount,
      message: data.message || null,
      status: "pending",
      payment_method: "midtrans",
    })
    .select("id")
    .single();

  if (error || !donation) {
    console.error("Donation insert error details:", error);
    return {
      success: false,
      error: `Gagal memproses donasi: ${error?.message || "Database error"}`,
    };
  }

  // Service-role client for payments insert (NO RLS INSERT policy — only service-role may write)
  const serviceSupabase = createServiceRoleClient();

  const orderId = `NURRISBA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const { error: paymentError } = await serviceSupabase.from("payments").insert({
    donation_id: donation.id,
    provider: "midtrans",
    order_id: orderId,
    gross_amount: data.amount,
    status: "pending",
  });

  if (paymentError) {
    console.error("Payment insert error details:", paymentError);
    return {
      success: false,
      error: `Gagal membuat transaksi pembayaran: ${paymentError.message}`,
    };
  }

  return {
    success: true,
    donationId: donation.id,
    orderId,
  };
}

export async function createManualDonation(
  input: DonationInput,
  method: PaymentMethodChoice
) {
  const result = donationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const data = result.data;
  const supabase = await createClient();

  const { data: donation, error } = await supabase
    .from("donations")
    .insert({
      campaign_id: data.campaign_id,
      donor_name: data.is_anonymous ? "Hamba Allah" : data.donor_name,
      donor_email: data.donor_email || null,
      donor_phone: data.donor_phone || null,
      is_anonymous: data.is_anonymous,
      amount: data.amount,
      message: data.message || null,
      status: "pending",
      payment_method: method,
    })
    .select("id")
    .single();

  if (error || !donation) {
    console.error("Manual donation insert error:", error);
    return {
      success: false,
      error: `Gagal memproses donasi: ${error?.message || "Database error"}`,
    };
  }

  const orderId = `NURRISBA-MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    success: true,
    donationId: donation.id,
    orderId,
  };
}
