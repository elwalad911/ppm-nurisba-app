"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPendingDonation } from "@/app/donasi/actions";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Loader2, ShieldCheck, Heart } from "lucide-react";

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 5000000];

interface DonationFormClientProps {
  campaignId: string;
}

export function DonationFormClient({ campaignId }: DonationFormClientProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>("100000");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleQuickAmount = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
    setIsCustom(false);
    setError(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    const num = Number(val);
    setAmount(isNaN(num) ? 0 : num);
    setIsCustom(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createPendingDonation({
        campaign_id: campaignId,
        amount,
        donor_name: isAnonymous ? "Hamba Allah" : donorName || "Hamba Allah",
        donor_email: donorEmail,
        donor_phone: donorPhone,
        is_anonymous: isAnonymous,
        message,
      });

      if (!result.success) {
        setError(result.error || "Terjadi kesalahan.");
        setIsSubmitting(false);
        return;
      }

      // Redirect to pending/result page or simulate payment
      router.push(`/donasi/result?donationId=${result.donationId}&orderId=${result.orderId}`);
    } catch {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-danger-soft p-4 text-sm text-danger font-medium">
          {error}
        </div>
      )}

      {/* Nominal Selection */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Pilih Nominal Wakaf / Donasi <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleQuickAmount(val)}
              className={`flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                !isCustom && amount === val
                  ? "border-primary bg-primary-soft text-primary ring-2 ring-primary/20"
                  : "border-border bg-background text-text-secondary hover:border-primary/50"
              }`}
            >
              {formatRupiah(val)}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-text-secondary">
            Rp
          </span>
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomChange}
            placeholder="Atau masukkan nominal lain"
            className="flex h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm font-semibold text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
          />
        </div>
        <p className="mt-1.5 text-xs text-text-muted">
          Minimum donasi adalah Rp 10.000
        </p>
      </div>

      {/* Anonymous Toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="anonymous" className="text-sm font-medium text-text-primary cursor-pointer">
          Sembunyikan nama saya (Tulis sebagai &ldquo;Hamba Allah&rdquo;)
        </label>
      </div>

      {/* Donor Information */}
      <div className="space-y-4">
        {!isAnonymous && (
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Nama Lengkap <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required={!isAnonymous}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Email (Opsional untuk bukti donasi)
          </label>
          <input
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            placeholder="nama@email.com"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Nomor WhatsApp (Opsional)
          </label>
          <input
            type="tel"
            value={donorPhone}
            onChange={(e) => setDonorPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Doa / Pesan Kebaikan (Opsional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan doa atau harapan baik Anda..."
            rows={3}
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border-light">
        <Button
          type="submit"
          disabled={isSubmitting || amount < 10000}
          className="w-full bg-cta hover:bg-cta/90 text-white h-12 text-base font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Heart className="mr-2 h-5 w-5" />
              Lanjut ke Pembayaran ({formatRupiah(amount)})
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-text-muted text-center">
        <ShieldCheck className="h-4 w-4 text-success" />
        <span>Transaksi aman dan terverifikasi oleh Yayasan Nurul Ikhlas.</span>
      </div>
    </form>
  );
}
