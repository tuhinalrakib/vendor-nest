"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, t } = useLanguage();

  const type = searchParams.get("type") || "stripe";
  const orderId = searchParams.get("order_id") || "";

  // Render info box depending on checkout payment channel
  const renderPaymentMessage = () => {
    switch (type) {
      case "cod":
        return (
          <div className="bg-amber-50/50 dark:bg-amber-950/40 border border-amber-250 dark:border-amber-900/50 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 leading-relaxed block">
              💵 {lang === "bn" ? "আপনি " : "You chose "}
              <span className="font-extrabold">{lang === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}</span>
              {lang === "bn" ? " বেছে নিয়েছেন।" : "."}
              <br />
              {lang === "bn" ? "আপনার অর্ডারটি হাতে পাওয়ার পর মূল্য পরিশোধ করুন।" : "Please pay when your order arrives."}
            </span>
          </div>
        );
      case "sslcommerz":
        return (
          <div className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/50 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 leading-relaxed block">
              📱 {lang === "bn" ? "এসএসএলকমার্স গেটওয়ের মাধ্যমে " : "Payment successfully completed via "}
              <span className="font-extrabold">{lang === "bn" ? "পেমেন্ট সফলভাবে সম্পন্ন হয়েছে" : "SSLCommerz Sandbox Gateway"}</span>
              {lang === "bn" ? "।" : "."}
            </span>
          </div>
        );
      case "stripe":
      default:
        return (
          <div className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/50 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 leading-relaxed block">
              💳 {lang === "bn" ? "স্ট্রাইপ সিকিউর গেটওয়ের মাধ্যমে " : "Payment successfully completed via "}
              <span className="font-extrabold">{lang === "bn" ? "পেমেন্ট সফলভাবে সম্পন্ন হয়েছে" : "Stripe Secure Card Gateway"}</span>
              {lang === "bn" ? "।" : "."}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-6 font-sans">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-md space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Animated Green Checkmark */}
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <svg
            className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Celebrations titles */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50">
            {lang === "bn" ? "অর্ডার সফলভাবে প্লেস করা হয়েছে! 🎉" : "Order Placed Successfully! 🎉"}
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
            {lang === "bn" ? "ভেন্ডরনেস্ট থেকে কেনাকাটা করার জন্য ধন্যবাদ" : "Thank you for shopping with VendorNest"}
          </p>
          {orderId && (
            <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold mt-1">
              {lang === "bn" ? "অর্ডার আইডি: " : "Order ID: "}{orderId}
            </p>
          )}
        </div>

        {/* Dynamic Payment Instruction Box */}
        {renderPaymentMessage()}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={async () => {
              try {
                // Fetch basic order details for the receipt using the configured api client
                const { default: api } = await import("@/lib/api");
                const res = await api.get(`/api/orders/${orderId}/`);
                const { generateInvoicePDF } = await import("@/lib/invoice");
                await generateInvoicePDF(res.data);
              } catch (e) {
                console.error("Failed to generate PDF", e);
                const { generateInvoicePDF } = await import("@/lib/invoice");
                await generateInvoicePDF({ id: orderId, status: "PENDING", total_amount: "0" });
              }
            }}
            className="w-full h-11 bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {lang === "bn" ? "মেমো ডাউনলোড করুন" : "Download Receipt"}
          </button>
          
          <Link
            href="/orders"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center uppercase tracking-wider"
          >
            {lang === "bn" ? "আমার অর্ডারসমূহ দেখুন" : "View My Orders"}
          </Link>
          <Link
            href="/products"
            className="w-full h-11 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
          >
            {lang === "bn" ? "আরও কেনাকাটা করুন" : "Continue Shopping"}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <span className="text-xs text-zinc-400 font-semibold animate-pulse">Loading success state...</span>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
