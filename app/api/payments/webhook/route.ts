import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySignature, mapMidtransStatus } from "@/lib/midtrans/utils";

// Supabase client with service role key for trusted server-side webhook processing
function getServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { error: "Invalid webhook payload missing required fields" },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-xxxxxxxxxxxx";

    // 1. Verify Signature Key (SHA-512)
    const isValid = verifySignature(
      order_id,
      status_code,
      gross_amount,
      serverKey,
      signature_key
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid signature" },
        { status: 401 }
      );
    }

    const supabase = getServiceRoleClient();

    // 2. Check Idempotency via payments table
    const { data: payment, error: paymentQueryError } = await supabase
      .from("payments")
      .select("*, donations(*)")
      .eq("order_id", order_id)
      .single();

    if (paymentQueryError || !payment) {
      return NextResponse.json(
        { error: "Payment order not found" },
        { status: 404 }
      );
    }

    // If payment is already in a final state and matches the same status, return 200 idempotent
    const newStatus = mapMidtransStatus(transaction_status, fraud_status);
    if (
      ["success", "expired", "failed"].includes(payment.status) &&
      payment.status === newStatus
    ) {
      return NextResponse.json({ status: "ok", message: "Already processed (idempotent)" });
    }

    const donationId = payment.donation_id;
    const campaignId = payment.donations?.campaign_id;

    // 3. Update Payment record
    const settlementAt = newStatus === "success" ? new Date().toISOString() : null;
    await supabase
      .from("payments")
      .update({
        status: newStatus,
        raw_status: transaction_status,
        fraud_status: fraud_status || null,
        transaction_id: transaction_id || payment.transaction_id,
        payment_type: payment_type || payment.payment_type,
        settlement_at: settlementAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    // 4. Update Donation record
    await supabase
      .from("donations")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donationId);

    // 5. If successful and wasn't success before, record ledger and update campaign current_amount
    if (newStatus === "success" && payment.status !== "success") {
      const amount = Number(gross_amount);

      // Insert financial transaction ledger
      if (campaignId) {
        await supabase.from("financial_transactions").insert({
          donation_id: donationId,
          campaign_id: campaignId,
          type: "income",
          amount: amount,
          source: "midtrans",
          reference: order_id,
          description: `Donasi sukses via Midtrans (Order ID: ${order_id})`,
        });

        // Fetch current campaign amount and increment
        const { data: campaign } = await supabase
          .from("campaigns")
          .select("current_amount")
          .eq("id", campaignId)
          .single();

        if (campaign) {
          const updatedAmount = Number(campaign.current_amount) + amount;
          await supabase
            .from("campaigns")
            .update({
              current_amount: updatedAmount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", campaignId);
        }
      }
    }

    return NextResponse.json({ status: "ok", processed_status: newStatus });
  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Internal server error during webhook processing" },
      { status: 500 }
    );
  }
}
