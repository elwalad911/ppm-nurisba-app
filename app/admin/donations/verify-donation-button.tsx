"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyManualDonation } from "./actions";
import { formatRupiah } from "@/lib/utils";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";

interface VerifyDonationButtonProps {
  donationId: string;
  donorName: string;
  amount: number;
  campaignTitle: string;
  createdAt: string;
}

export function VerifyDonationButton({
  donationId,
  donorName,
  amount,
  campaignTitle,
  createdAt,
}: VerifyDonationButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const handleVerify = () => {
    startTransition(async () => {
      const res = await verifyManualDonation(donationId);
      setResult(res);
      if (res.success) {
        setTimeout(() => {
          setIsOpen(false);
          setResult(null);
          router.refresh();
        }, 1500);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setResult(null);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-success/90 active:scale-95 min-h-[36px]"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verifikasi
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isPending && setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-danger-soft/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-soft text-warning">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Verifikasi Donasi Manual
                  </h3>
                  <p className="text-xs text-text-muted">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isPending && setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
                disabled={isPending}
              >
                <X className="h-4 w-4 text-text-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {result?.success ? (
                <div className="flex flex-col items-center py-6 space-y-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-bold text-success">
                    Verifikasi Berhasil
                  </p>
                  <p className="text-sm text-text-secondary text-center">
                    Donasi telah dicatat sebagai sukses dan masuk ke buku kas.
                  </p>
                </div>
              ) : (
                <>
                  {/* Donation details */}
                  <div className="rounded-xl border border-outline-variant/50 bg-surface p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Donatur</span>
                      <span className="font-semibold text-text-primary">
                        {donorName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Program</span>
                      <span className="font-semibold text-text-primary text-right max-w-[200px] line-clamp-1">
                        {campaignTitle}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Nominal</span>
                      <span className="font-extrabold text-primary text-base tabular-nums">
                        {formatRupiah(amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Waktu</span>
                      <span className="font-medium text-text-primary">
                        {createdAt}
                      </span>
                    </div>
                  </div>

                  {result?.error && (
                    <div className="rounded-xl bg-danger-soft border border-danger/30 p-3 text-xs text-danger font-medium">
                      {result.error}
                    </div>
                  )}

                  <p className="text-xs text-text-secondary leading-relaxed">
                    Dengan mengkonfirmasi, Anda menyatakan bahwa pembayaran
                    sebesar{" "}
                    <strong className="text-primary">
                      {formatRupiah(amount)}
                    </strong>{" "}
                    telah diterima secara fisik dan akan dicatat sebagai donasi
                    sukses di buku kas.
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            {!result?.success && (
              <div className="px-6 py-4 border-t border-border bg-surface flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="px-4 h-9 rounded-xl border border-outline-variant text-sm font-semibold text-text-secondary hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isPending}
                  className="px-5 h-9 rounded-xl bg-success text-white text-sm font-bold shadow-sm hover:bg-success/90 active:scale-95 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Ya, Verifikasi
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
