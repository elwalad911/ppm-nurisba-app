import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { ShieldAlert, Info } from "lucide-react";
import { VerifyDonationButton } from "./verify-donation-button";

export const metadata: Metadata = {
  title: "Kelola Donations — Admin PPM Nurisba",
};

export const revalidate = 0;

interface DonationItem {
  id: string;
  donor_name: string;
  donor_email: string | null;
  is_anonymous: boolean;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  campaigns?: { title: string };
  payments?: { order_id: string; payment_type: string }[];
}

const MANUAL_METHODS = ["manual_bank", "qris_manual"];

export default async function AdminDonationsPage() {
  const supabase = await createClient();

  const { data: donations } = await supabase
    .from("donations")
    .select("*, campaigns(title), payments(order_id, payment_type)")
    .order("created_at", { ascending: false });

  const donationList = (donations || []) as unknown as DonationItem[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Kelola Donasi
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Pantau seluruh komitmen dan transaksi donasi yang masuk.
        </p>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-4 text-warning">
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Kebijakan Keuangan & Integritas:</span>{" "}
          Donasi via <strong>Midtrans</strong> hanya dapat diverifikasi oleh
          sistem melalui webhook terverifikasi — admin tidak dapat mengubahnya.
          Donasi <strong>transfer bank manual / QRIS statis</strong> dapat
          diverifikasi oleh admin karena tidak ada payment gateway yang mengirim
          konfirmasi otomatis.
        </div>
      </div>

      {/* Manual Verification Info */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft/50 p-4 text-text-secondary">
        <Info className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
        <div className="text-xs leading-relaxed">
          Tombol <strong>&ldquo;Verifikasi&rdquo;</strong> hanya muncul untuk
          donasi manual (transfer bank / QRIS) yang masih berstatus{" "}
          <strong>pending</strong>. Donasi Midtrans yang pending adalah normal
          (menunggu pembayaran / webhook).
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
            <tr>
              <th className="px-6 py-4">Donatur</th>
              <th className="px-6 py-4">Campaign</th>
              <th className="px-6 py-4">Nominal</th>
              <th className="px-6 py-4">Metode</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-text-primary">
            {donationList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  Belum ada transaksi donasi.
                </td>
              </tr>
            ) : (
              donationList.map((item) => {
                const canVerify =
                  item.status === "pending" &&
                  MANUAL_METHODS.includes(item.payment_method || "") &&
                  (item.payments?.length || 0) === 0;

                return (
                  <tr key={item.id} className="hover:bg-background/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-primary">{item.donor_name}</p>
                      <p className="text-xs text-text-muted">
                        {item.donor_email || "Tanpa email"}{" "}
                        {item.is_anonymous && "(Anonim)"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                      {item.campaigns?.title || "Campaign"}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary tabular-nums">
                      {formatRupiah(item.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-text-secondary uppercase font-medium">
                        {item.payments?.[0]?.payment_type || item.payment_method}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "success"
                            ? "bg-success-soft text-success"
                            : item.status === "pending"
                            ? "bg-warning-soft text-warning"
                            : "bg-danger-soft text-danger"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canVerify ? (
                        <VerifyDonationButton
                          donationId={item.id}
                          donorName={item.donor_name}
                          amount={item.amount}
                          campaignTitle={item.campaigns?.title || "Campaign"}
                          createdAt={new Date(item.created_at).toLocaleString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        />
                      ) : (
                        <span className="text-xs text-text-muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {donationList.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            Belum ada transaksi donasi.
          </div>
        ) : (
          donationList.map((item) => {
            const canVerify =
              item.status === "pending" &&
              MANUAL_METHODS.includes(item.payment_method || "") &&
              (item.payments?.length || 0) === 0;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-text-primary line-clamp-1">
                      {item.donor_name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {item.campaigns?.title || "Campaign"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.status === "success"
                        ? "bg-success-soft text-success"
                        : item.status === "pending"
                        ? "bg-warning-soft text-warning"
                        : "bg-danger-soft text-danger"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-primary tabular-nums">
                    {formatRupiah(item.amount)}
                  </p>
                  <p className="font-mono text-xs text-text-muted">
                    {item.payments?.[0]?.order_id || "-"}
                  </p>
                </div>
                {canVerify && (
                  <div className="mt-3 pt-3 border-t border-border-light">
                    <VerifyDonationButton
                      donationId={item.id}
                      donorName={item.donor_name}
                      amount={item.amount}
                      campaignTitle={item.campaigns?.title || "Campaign"}
                      createdAt={new Date(item.created_at).toLocaleString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
