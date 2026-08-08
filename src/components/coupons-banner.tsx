"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function CouponsBanner() {
  const { t } = useLanguage();

  return (
    <section className="bg-zinc-50 dark:bg-zinc-950 py-12 border-t border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-linear-to-r from-emerald-500 to-teal-650 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="text-left space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              {t("couponsBanner.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("couponsBanner.title")}
            </h2>
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              {t("couponsBanner.subtitle")}
            </p>
          </div>
          <Link
            href="/coupons"
            className="h-12 px-8 bg-white hover:bg-zinc-100 text-emerald-800 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center shrink-0"
          >
            {t("couponsBanner.btn")}
          </Link>
        </div>
      </div>
    </section>
  );
}
