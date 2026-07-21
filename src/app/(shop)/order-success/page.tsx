"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") || "stripe";
  const orderId = searchParams.get("order_id") || "";

  // Render info box depending on checkout payment channel
  const renderPaymentMessage = () => {
    switch (type) {
      case "cod":
        return (
          <div className="bg-amber-50/50 border border-amber-250 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-800 leading-relaxed block">
              💵 You chose <span className="font-extrabold">Cash on Delivery</span>.
              <br />
              Please pay when your order arrives.
            </span>
          </div>
        );
      case "sslcommerz":
        return (
          <div className="bg-emerald-50/50 border border-emerald-250 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-800 leading-relaxed block">
              📱 Payment successfully completed via <span className="font-extrabold">SSLCommerz Sandbox Gateway</span>.
            </span>
          </div>
        );
      case "stripe":
      default:
        return (
          <div className="bg-emerald-50/50 border border-emerald-250 p-4 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-800 leading-relaxed block">
              💳 Payment successfully completed via <span className="font-extrabold">Stripe Secure Card Gateway</span>.
            </span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 py-12 px-6 font-sans">
      <div className="bg-white border border-zinc-200 p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-md space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Animated Green Checkmark */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <svg
            className="w-8 h-8 text-emerald-600"
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
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
            Order Placed Successfully! 🎉
          </h2>
          <p className="text-xs text-zinc-400 font-semibold">
            Thank you for shopping with VendorNest
          </p>
          {orderId && (
            <p className="text-[10px] font-mono text-zinc-400 font-bold mt-1">
              Order ID: {orderId}
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
            className="w-full h-11 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Receipt
          </button>
          
          <Link
            href="/orders"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center uppercase tracking-wider"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="w-full h-11 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-650 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
          >
            Continue Shopping
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
