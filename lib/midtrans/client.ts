/**
 * Midtrans Snap Client Integration
 * Siap pakai ketika MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY asli diisi di .env.local
 */

interface SnapTransactionParams {
  orderId: string;
  grossAmount: number;
  customerDetails: {
    firstName: string;
    email?: string;
    phone?: string;
  };
  itemDetails?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}

export async function createMidtransSnapToken(params: SnapTransactionParams): Promise<{ token: string; redirectUrl: string } | { error: string }> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  // Check if server key is still placeholder
  if (!serverKey || serverKey.includes("xxxxxxxxxxxx") || serverKey.includes("testkey")) {
    return {
      error: "Metode pembayaran online sedang dalam pemeliharaan atau belum dikonfigurasi. Silakan gunakan metode transfer manual.",
    };
  }

  const authString = Buffer.from(serverKey + ":").toString("base64");
  const apiUrl = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerDetails.firstName,
      email: params.customerDetails.email || undefined,
      phone: params.customerDetails.phone || undefined,
    },
    item_details: params.itemDetails || [
      {
        id: "WAKAF-PENGEMBANGAN",
        price: params.grossAmount,
        quantity: 1,
        name: "Wakaf Pembangunan PPM Nurisba",
      },
    ],
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("Midtrans API Error:", errData);
      return {
        error: "Gagal membuat sesi pembayaran dengan Midtrans. Silakan coba beberapa saat lagi.",
      };
    }

    const data = await res.json();
    return {
      token: data.token,
      redirectUrl: data.redirect_url,
    };
  } catch (err) {
    console.error("Midtrans connection error:", err);
    return {
      error: "Terjadi kesalahan koneksi ke gateway pembayaran.",
    };
  }
}
