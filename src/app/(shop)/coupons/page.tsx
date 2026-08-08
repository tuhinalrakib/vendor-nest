"use client";

import React, { useState, useEffect } from "react";
import CouponCard from "@/components/coupons/CouponCard";
import api from "@/lib/api";
import Swal from "sweetalert2";
import { useLanguage } from "@/lib/LanguageContext";

interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  min_purchase: string;
  expiry_date: string;
  seller_shop: string;
  seller: string | null;
  is_used: boolean;
}

export default function CouponsLandingPage() {
  const { lang, t } = useLanguage();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "percentage" | "fixed">("all");

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/coupons/");
      setCoupons(res.data);
      setFilteredCoupons(res.data);
    } catch (err) {
      console.error("Failed to load active coupons:", err);
      Swal.fire({
        title: lang === "bn" ? "লোড ব্যর্থ হয়েছে" : "Load Failed",
        text: lang === "bn" ? "একটিভ কুপনসমূহ লোড করা যায়নি। অনুগ্রহ করে রিফ্রেশ করুন।" : "Could not fetch active coupons. Please refresh the page.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter coupons dynamically when search query or filter type changes
  useEffect(() => {
    let result = [...coupons];

    // Apply Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.seller_shop.toLowerCase().includes(q)
      );
    }

    // Apply Type Filter
    if (filterType !== "all") {
      result = result.filter((c) => c.discount_type === filterType);
    }

    setFilteredCoupons(result);
  }, [searchQuery, filterType, coupons]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans py-12 px-6 sm:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 border border-zinc-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-left space-y-4 max-w-xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold text-indigo-400">
              {lang === "bn" ? "🏷️ স্মার্ট সেভিংস" : "🏷️ Smart Savings"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {lang === "bn" ? (
                <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  মার্কেটপ্লেস কুপন ও অফারসমূহ
                </span>
              ) : (
                <>
                  Marketplace <br />
                  <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Coupons & Offers
                  </span>
                </>
              )}
            </h1>
            <p className="text-zinc-400 text-sm font-semibold leading-relaxed">
              {lang === "bn"
                ? "চেকআউটে ডিসকাউন্ট পেতে সেলার কুপনসমূহ সংগ্রহ করুন। অথরাইজড মার্চেন্টদের থেকে সরাসরি শপিং করুন।"
                : "Clip vendor coupons below to automatically save at checkout. Shop directly from authorized multi-tenant SaaS sellers."}
            </p>
          </div>

          <div className="w-full md:w-auto relative z-10 shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2 text-left min-w-64">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">
                {lang === "bn" ? "প্রো টিপ" : "Pro Tip"}
              </span>
              <p className="text-xs text-zinc-300 font-semibold leading-normal">
                {lang === "bn"
                  ? "কুপন ক্লেইম করলে তা আপনার অ্যাকাউন্টে সেভ থাকবে এবং কার্টে প্রোডাক্ট যোগ করার সময় স্বয়ংক্রিয়ভাবে এপ্লাই হবে! কোনো কোড টাইপ করার প্রয়োজন নেই।"
                  : "Clipped coupons are saved in your account context and applied **automatically** when you add eligible items to your cart! No code entry required."}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder={lang === "bn" ? "কুপন কোড বা শপের নাম দিয়ে খুঁজুন..." : "Search by code or merchant shop..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-650 focus:bg-white dark:focus:bg-zinc-900 rounded-xl text-xs font-bold outline-none text-zinc-800 dark:text-zinc-50"
            />
            <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto overflow-x-auto shrink-0">
            {(["all", "percentage", "fixed"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`h-9 px-4.5 rounded-lg text-xs font-extrabold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filterType === type
                    ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs"
                    : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {type === "all" 
                  ? (lang === "bn" ? "সকল কুপন" : "All Coupons") 
                  : type === "percentage" 
                  ? (lang === "bn" ? "পার্সেন্টেজ ডিসকাউন্ট" : "Percentage Off") 
                  : (lang === "bn" ? "ফিক্সড অ্যামাউন্ট ডিসকাউন্ট" : "Fixed Amount Off")}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Showcase Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 border border-dashed border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl animate-pulse flex items-center justify-center">
                <span className="text-xs text-zinc-400 font-semibold">{lang === "bn" ? "অফার লোড হচ্ছে..." : "Loading offer..."}</span>
              </div>
            ))}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-24 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              🏷️
            </div>
            <h3 className="text-base font-extrabold text-zinc-800 dark:text-zinc-100">
              {lang === "bn" ? "কোনো একটিভ কুপন পাওয়া যায়নি" : "No active coupons found"}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-1">
              {lang === "bn"
                ? "নতুন প্রমোশন ও বিশেষ অফারের জন্য আবার চেক করুন!"
                : "Check back later for seasonal promotions, flash sales, or shop-specific coupon deals!"}
            </p>
            {(searchQuery || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="mt-5 h-9 px-6 rounded-full bg-indigo-550 text-white font-bold text-xs hover:bg-indigo-500 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {lang === "bn" ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                code={coupon.code}
                type={coupon.discount_type}
                value={parseFloat(coupon.discount_value)}
                minPurchase={parseFloat(coupon.min_purchase)}
                sellerShop={coupon.seller_shop}
                isUsed={coupon.is_used}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
