"use server";

import { createClient } from "@/lib/supabase/server";
import { donationSchema, type DonationInput } from "@/lib/validations/donation";

export async function createPendingDonation(input: DonationInput) {
  const result = donationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const data = result.data;
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
    return {
      success: false,
      error: "Gagal memproses donasi. Silakan coba kembali.",
    };
  }

  // Also create corresponding payment row with unique order_id
  const orderId = `NURRISBA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  const { error: paymentError } = await supabase.from("payments").insert({
    donation_id: donation.id,
    provider: "midtrans",
    order_id: orderId,
    gross_amount: data.amount,
    status: "pending",
  });

  if (paymentError) {
    return {
      success: false,
      error: "Gagal membuat transaksi pembayaran.",
    };
  }

  return {
    success: true,
    donationId: donation.id,
    orderId,
  };
}
