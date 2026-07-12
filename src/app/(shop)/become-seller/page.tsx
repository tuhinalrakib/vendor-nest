"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function BecomeSellerPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogoutAndRegister = async () => {
    Swal.fire({
      title: "Register a Merchant Account",
      text: "You are currently logged in as a Customer. To register a Seller Shop, we will log you out first. Do you want to proceed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out & Register",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        router.push("/register?role=seller");
      }
    });
  };

  const steps = [
    {
      number: "01",
      title: "Register Seller Shop",
      desc: "Fill in your merchant credentials, choose your customized shop name, and set your unique subdomain identifier.",
    },
    {
      number: "02",
      title: "Link Payout Gateways",
      desc: "Connect your bank account securely using Stripe Connect, Wise, or Payoneer to receive automated customer payouts.",
    },
    {
      number: "03",
      title: "List Products with AI",
      desc: "Use our built-in Gemini AI generator to create SEO-friendly product details, set pricing levels, and go live instantly.",
    },
    {
      number: "04",
      title: "Sell & Grow",
      desc: "Track real-time orders, check visitor traffic graphs, create discount coupons, and grow your digital storefront.",
    },
  ];

  const benefits = [
    {
      title: "Custom Shop Subdomain",
      desc: "Get your own branded subdomain (e.g. yourname.vendornest.com) or map a custom root domain to your portal.",
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: "Real-time Stripe Payouts",
      desc: "No more waiting weeks for payments. Payouts are split automatically and wire transferred directly net of commissions.",
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Built-in Gemini AI Generator",
      desc: "Struggling with copywriting? Instantly create SEO product descriptions, keywords, and meta tags with one click.",
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Discount Coupon Manager",
      desc: "Promote store conversions by creating custom coupon codes with percentage or fixed discount constraints.",
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-white font-sans">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-b from-indigo-50/50 to-white overflow-hidden border-b border-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6 max-w-4xl mx-auto">
          <span className="inline-block px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider">
            Become a Verified Merchant
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-950 tracking-tight leading-none">
            Start your digital shop in <span className="text-indigo-650">Minutes</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            VendorNest provides the complete multi-tenant infrastructure. Host your storefront, automate customer split payments, and write copy with integrated AI tools.
          </p>

          {/* Dynamic Hero CTA based on role */}
          <div className="pt-6 flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/register?role=seller"
                  className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Create Seller Account
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Login to Merchant Portal
                </Link>
              </>
            ) : user?.role === "seller" ? (
              <Link
                href="/seller/dashboard"
                className="px-8 py-4 rounded-2xl bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Go to Seller Dashboard
              </Link>
            ) : user?.role === "admin" ? (
              <Link
                href="/admin/dashboard"
                className="px-8 py-4 rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Go to Admin Dashboard
              </Link>
            ) : (
              <button
                onClick={handleLogoutAndRegister}
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Sign Up as a Merchant
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Benefits / Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
            Why sell on <span className="text-indigo-600 font-extrabold">VendorNest</span>?
          </h2>
          <p className="text-sm text-zinc-500">
            SaaS infrastructure built to remove developer complexity and help you sell products globally with zero overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-zinc-200 bg-white hover:border-zinc-350 hover:shadow-xs transition-all duration-300 flex items-start gap-4 text-left"
            >
              <div className="p-3 rounded-xl bg-indigo-50 shrink-0">
                {benefit.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-zinc-900">{benefit.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Timeline */}
      <section className="py-20 bg-zinc-50 border-t border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-black text-zinc-950 tracking-tight">Onboarding Timeline</h2>
            <p className="text-sm text-zinc-500">
              Four simple phases to register your company and start collecting orders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-3xl p-6 text-left relative shadow-xs hover:border-zinc-300 transition-colors"
              >
                <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4 font-mono leading-none">
                  {step.number}
                </span>
                <div className="space-y-2 mt-4">
                  <h3 className="text-sm font-extrabold text-zinc-950 tracking-tight">{step.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-black text-zinc-950 tracking-tight">Ready to launch your store?</h2>
        <p className="text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Start for free on our Starter tier (only paying platform commission on actual transactions) and scale as you grow. No setup fees or monthly obligations.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/seller/pricing"
            className="px-6 py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
          >
            Explore Pricing Plans
          </Link>
          <Link
            href="/seller/faq"
            className="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-black border border-zinc-200 transition-all cursor-pointer"
          >
            Read Seller FAQ
          </Link>
        </div>
      </section>
    </div>
  );
}
