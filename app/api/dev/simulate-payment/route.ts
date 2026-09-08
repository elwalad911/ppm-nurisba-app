/**
 * ============================================================================
 * PERHATIAN KHUSUS / SECURITY WARNING:
 * ENDPOINT INI HARUS DIHAPUS ATAU DIPASTIKAN TER-DISABLE SEBELUM PRODUCTION DEPLOY!
 * Endpoint ini hanya simulator dev-only untuk memicu webhook Midtrans secara lokal
 * tanpa memerlukan akun Midtrans sandbox yang aktif.
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { POST as webhookHandler } from "@/app/api/payments/webhook/route";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // 1. WAJIB check NODE_ENV === 'development' di baris paling awal
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { order_id, status } = await req.json();

    if (!order_id || !status) {
      return NextResponse.json(
        { error: "Missing order_id or status" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: payment } = await supabase
      .from("payments")
      .select("gross_amount")
      .eq("order_id", order_id)
      .single();

    if (!payment) {
      return NextResponse.json(
        { error: `Payment with order_id ${order_id} not found in DB` },
        { status: 404 }
      );
    }

    const statusCode = status === "success" ? "200" : "201";
    const grossAmount = `${Number(payment.gross_amount)}.00`;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-xxxxxxxxxxxx";

    // Generate SHA-512 signature matching Midtrans format
    const payload = order_id + statusCode + grossAmount + serverKey;
    const signatureKey = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    const transactionStatus =
      status === "success"
        ? "settlement"
        : status === "failed"
        ? "deny"
        : status === "expired"
        ? "expire"
        : "pending";

    const webhookPayload = {
      order_id,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: "accept",
      transaction_id: `SIMULATED-TX-${Date.now()}`,
      payment_type: "qris",
    };

    // Construct internal NextRequest to call webhook handler directly
    const simulatedReq = new NextRequest(
      new URL("/api/payments/webhook", req.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      }
    );

    // Call webhook handler
    const webhookRes = await webhookHandler(simulatedReq);
    const webhookResJson = await webhookRes.json();

    return NextResponse.json({
      success: true,
      message: `Simulated payment status '${status}' successfully triggered via webhook.`,
      webhook_response: webhookResJson,
    });
  } catch (err: unknown) {
    console.error("Simulation error:", err);
    const message = err instanceof Error ? err.message : "Unknown simulation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
