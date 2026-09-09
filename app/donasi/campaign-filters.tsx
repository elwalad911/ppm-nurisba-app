"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, AlertCircle, ArrowRight } from "lucide-react";
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
  "Semua",
  "Wakaf",
  "Beasiswa",
  "Sedekah",
  "Infaq Pendidikan",
  "Sosial",
];

export function CampaignFilters({ campaigns }: { campaigns: Campaign[] }) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered =
    activeCategory === "Semua"
      ? campaigns
      : campaigns.filter((c) => {
          if (!c.category) return false;
          return (
            c.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
            (activeCategory === "Beasiswa" && c.category.toLowerCase().includes("pendidikan"))
          );
        });

  return (
    <>
      {/* Category Pills — Horizontal scroll on mobile, flex-wrap on desktop */}
      <section className="w-full">
        <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 hide-scrollbar snap-x">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "snap-start flex-none px-5 py-2.5 rounded-full text-sm font-semibold min-h-[44px] whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95",
                  isActive
                    ? "bg-primary text-white shadow-md hover:-translate-y-0.5"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:-translate-y-0.5"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Campaign Grid — 1 col on mobile, 2 col on tablet, 3 col on desktop */}
      <section>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
            <AlertCircle className="h-12 w-12 text-text-muted" />
            <h3 className="mt-4 text-lg font-bold text-text-primary">
              Belum ada program donasi aktif untuk kategori ini
            </h3>
            <p className="mt-1 text-sm text-text-secondary max-w-md">
              Silakan pilih kategori lain atau cek kembali secara berkala.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((campaign, index) => {
              const target = Number(campaign.target_amount);
              const current = Number(campaign.current_amount);
              const percentage =
                target > 0
                  ? Math.min(Math.round((current / target) * 100), 100)
                  : 0;
              const isFeatured = index === 0;

              return (
                <article
                  key={campaign.id}
                  className={cn(
                    "bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 group border border-outline-variant/20",
                    isFeatured ? "shadow-xl ring-1 ring-primary/10" : "shadow-md hover:shadow-lg"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-surface-container-high">
                    {campaign.image_url ? (
                      <Image
                        src={campaign.image_url}
                        alt={campaign.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/20">
                        <Heart className="h-14 w-14" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary/95 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
                      {campaign.category || "Wakaf"}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 leading-snug">
                      <Link
                        href={`/donasi/${campaign.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {campaign.title}
                      </Link>
                    </h3>

                    {campaign.description && (
                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-6 leading-relaxed">
                        {campaign.description}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="mt-auto space-y-2 pt-2">
                      <div className="flex justify-between items-end text-xs mb-1">
                        <div>
                          <span className="text-text-muted block text-[11px]">Terkumpul</span>
                          <span className="font-bold text-primary text-base tabular-nums">
                            {formatRupiah(current)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-text-muted block text-[11px]">Target</span>
                          <span className="text-text-secondary font-medium tabular-nums">
                            {formatRupiah(target)}
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-on-surface-variant font-medium pt-1">
                        <span>Status: Aktif</span>
                        <span className="text-primary font-bold">{percentage}% Tercapai</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-6 pt-3 border-t border-border-light">
                      {isFeatured ? (
                        <Link
                          href={`/donasi/${campaign.slug}`}
                          className="w-full bg-cta text-white text-sm font-semibold py-3 rounded-xl shadow-md hover:bg-cta-strong active:scale-95 transition-all duration-200 min-h-[44px] flex justify-center items-center gap-2"
                        >
                          Donasi Sekarang
                          <Heart className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Link
                          href={`/donasi/${campaign.slug}`}
                          className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-all duration-200 min-h-[44px] flex justify-center items-center gap-2"
                        >
                          Donasi
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
