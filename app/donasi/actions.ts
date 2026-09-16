"use server";

import { createClient } from "@/lib/supabase/server";
import { donationSchema, type DonationInput } from "@/lib/validations/donation";

type PaymentMethodChoice = "manual_bank" | "qris_manual";

export async function createPendingDonation(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _input: DonationInput
) {
  return {
    success: false,
    error:
      "Pembayaran online sedang belum tersedia. Silakan gunakan transfer bank atau QRIS.",
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
