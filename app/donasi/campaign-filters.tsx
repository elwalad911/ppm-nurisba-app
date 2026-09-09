"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  current_amount: number;
  target_amount: number;
}

const categories = [
  "Semua Program",
  "Wakaf",
  "Zakat",
  "Infaq Pendidikan",
  "Bantuan Yatim",
];

export function CampaignFilters({ campaigns }: { campaigns: Campaign[] }) {
  const [activeCategory, setActiveCategory] = useState("Semua Program");

  const filtered =
    activeCategory === "Semua Program"
      ? campaigns
      : campaigns.filter((c) => c.category === activeCategory);

  return (
    <>
      {/* Category Pills */}
      <section className="w-full">
        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "snap-start flex-none px-5 py-2.5 rounded-full text-sm font-semibold min-h-[44px] whitespace-nowrap transition-colors",
                activeCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Campaign List */}
      <section className="flex flex-col gap-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
            <AlertCircle className="h-12 w-12 text-text-muted" />
            <h3 className="mt-4 text-lg font-bold text-text-primary">
              Belum ada program donasi aktif
            </h3>
            <p className="mt-1 text-sm text-text-secondary max-w-md">
              Program wakaf dan pembangunan akan segera dibuka kembali.
            </p>
          </div>
        ) : (
          filtered.map((campaign, index) => {
            const percentage = Math.min(
              Math.round(
                (Number(campaign.current_amount) /
                  Number(campaign.target_amount)) *
                  100
              ),
              100
            );
            const isFeatured = index === 0;

            return (
              <article
                key={campaign.id}
                className={cn(
                  "bg-white rounded-2xl overflow-hidden flex flex-col relative transform transition-transform hover:-translate-y-1 duration-300",
                  isFeatured
                    ? "shadow-2xl"
                    : "shadow-md border border-outline-variant/20"
                )}
              >
                <div
                  className={cn(
                    "relative w-full",
                    isFeatured ? "h-48" : "h-40"
                  )}
                >
                  {campaign.image_url ? (
                    <Image
                      src={campaign.image_url}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface-container-high text-primary/20">
                      <Heart className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {campaign.category || "Wakaf"}
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <h3
                    className={cn(
                      "font-bold text-on-surface line-clamp-2",
                      isFeatured ? "text-lg" : "text-base"
                    )}
                  >
                    <Link
                      href={`/donasi/${campaign.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {campaign.title}
                    </Link>
                  </h3>

                  {isFeatured && campaign.description && (
                    <p className="text-sm text-on-surface-variant line-clamp-2">
                      {campaign.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-primary">
                        {formatRupiah(campaign.current_amount)}
                      </span>
                      {isFeatured && (
                        <span className="text-on-surface-variant text-xs">
                          terkumpul dari{" "}
                          {formatRupiah(campaign.target_amount)}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {isFeatured && (
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>{campaign.current_amount > 0 ? "Donatur" : "Mulai donasi"}</span>
                        <span className="text-primary font-bold">
                          {percentage}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  {isFeatured ? (
                    <Link
                      href={`/donasi/${campaign.slug}`}
                      className="mt-2 w-full bg-cta text-white text-sm font-semibold py-3.5 rounded-xl shadow-md hover:bg-cta-strong active:scale-95 transition-all duration-200 min-h-[44px] flex justify-center items-center gap-2"
                    >
                      Donasi Sekarang
                      <Heart className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/donasi/${campaign.slug}`}
                      className="w-full border-2 border-primary text-primary text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/5 active:scale-95 transition-all duration-200 min-h-[44px] flex justify-center items-center"
                    >
                      Donasi
                    </Link>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </>
  );
}
