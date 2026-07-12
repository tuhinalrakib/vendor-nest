"use client";

import React, { useState, useEffect } from "react";
import CouponCard from "@/components/coupons/CouponCard";
import api from "@/lib/api";
import Swal from "sweetalert2";

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
        title: "Load Failed",
        text: "Could not fetch active coupons. Please refresh the page.",
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
    <div className="min-h-screen bg-zinc-50 font-sans py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 border border-zinc-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-left space-y-4 max-w-xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold text-indigo-400">
              🏷️ Smart Savings
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Marketplace <br />
              <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Coupons & Offers
              </span>
            </h1>
            <p className="text-zinc-400 text-sm font-semibold leading-relaxed">
              Clip vendor coupons below to automatically save at checkout. Shop directly from authorized multi-tenant SaaS sellers.
            </p>
          </div>

          <div className="w-full md:w-auto relative z-10 shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2 text-left min-w-64">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Pro Tip</span>
              <p className="text-xs text-zinc-300 font-semibold leading-normal">
                Clipped coupons are saved in your account context and applied **automatically** when you add eligible items to your cart! No code entry required.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-zinc-200 p-4 rounded-2xl shadow-xs">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search by code or merchant shop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-xs font-bold outline-none text-zinc-800"
            />
            <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 w-full sm:w-auto overflow-x-auto shrink-0">
            {(["all", "percentage", "fixed"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`h-9 px-4.5 rounded-lg text-xs font-extrabold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filterType === type
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {type === "all" ? "All Coupons" : type === "percentage" ? "Percentage Off" : "Fixed Amount Off"}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Showcase Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 border border-dashed border-zinc-250 bg-white rounded-2xl animate-pulse flex items-center justify-center">
                <span className="text-xs text-zinc-400 font-semibold">Loading offer...</span>
              </div>
            ))}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-24 text-center bg-white border border-zinc-200 rounded-3xl p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              🏷️
            </div>
            <h3 className="text-base font-extrabold text-zinc-800">No active coupons found</h3>
            <p className="text-xs text-zinc-400 font-semibold mt-1">
              Check back later for seasonal promotions, flash sales, or shop-specific coupon deals!
            </p>
            {(searchQuery || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="mt-5 h-9 px-6 rounded-full bg-indigo-550 text-white font-bold text-xs hover:bg-indigo-500 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Reset Filters
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
