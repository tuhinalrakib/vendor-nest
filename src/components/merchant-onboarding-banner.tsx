"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function MerchantOnboardingBanner() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-zinc-50 dark:bg-zinc-950 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans transition-colors duration-300 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Slim & Stylish Merchant Banner */}
        <div className="bg-linear-to-r from-zinc-950 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 sm:p-10 border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Background Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Content Column */}
          <div className="space-y-4 text-center lg:text-left relative z-10 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              💼 {t("banner.portalBadge", "VendorNest Merchant Portal")}
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {t("banner.title1", "Earn Money Selling on VendorNest")} <br />
              <span className="bg-linear-to-r from-indigo-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                {t("banner.title2", "Register as a Verified Seller Today")}
              </span>
            </h2>

            {/* Micro Highlights Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                🚀 {t("banner.zeroFee", "Zero Setup Fee")}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                🤖 {t("banner.aiGen", "Built-in Gemini AI Generator")}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                💳 {t("banner.payouts", "Automated Weekly Payouts")}
              </span>
            </div>
          </div>

          {/* Right Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 relative z-10 w-full sm:w-auto shrink-0">
            <Link
              href="/become-seller"
              className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t("banner.registerBtn", "Register as Verified Seller →")}</span>
            </Link>
            <Link
              href="/seller/pricing"
              className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center"
            >
              {t("banner.pricingBtn", "Explore Merchant Plans")}
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
