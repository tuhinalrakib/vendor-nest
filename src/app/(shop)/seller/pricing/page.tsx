"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  badge?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  commission: string;
  features: PlanFeature[];
  buttonText: string;
  buttonHref: string;
  gradient: string;
  isPopular?: boolean;
}

export default function MerchantPricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [rates, setRates] = useState({
    starter: "5.0",
    growth: "2.0",
    enterprise: "0.5"
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/dashboard/settings/`);
        if (response.ok) {
          const data = await response.json();
          setRates({
            starter: String(data.starter_commission_rate ?? "5.0"),
            growth: String(data.growth_commission_rate ?? "2.0"),
            enterprise: String(data.enterprise_commission_rate ?? "0.5")
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchConfig();
  }, []);

  const plans: Plan[] = [
    {
      name: "Starter",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for new merchants looking to list their first products.",
      commission: `${rates.starter}% platform commission`,
      gradient: "from-zinc-50 to-zinc-100 border-zinc-200 text-zinc-900",
      buttonText: "Start Selling Free",
      buttonHref: "/become-seller",
      features: [
        { text: "Up to 15 Product Listings", included: true },
        { text: "Basic Shop Customization", included: true },
        { text: "Stripe Connect Integration", included: true },
        { text: "Standard Email Support (24h)", included: true },
        { text: "Custom Subdomain (shop.vendornest.com)", included: false },
        { text: "Advanced Sales Analytics", included: false },
        { text: "AI Description & SEO Generator", included: false },
      ],
    },
    {
      name: "Growth",
      badge: "Most Popular",
      monthlyPrice: 29,
      yearlyPrice: 24, // $24 * 12 = $288 / year
      description: "Designed for scaling sellers who want premium platform benefits.",
      commission: `${rates.growth}% platform commission`,
      gradient: "from-indigo-50/50 to-violet-50/50 border-indigo-200 text-zinc-900 ring-2 ring-indigo-600",
      buttonText: "Upgrade to Growth",
      buttonHref: "/become-seller",
      isPopular: true,
      features: [
        { text: "Unlimited Product Listings", included: true },
        { text: "Advanced Shop Customization", included: true },
        { text: "Stripe Connect Integration", included: true },
        { text: "Priority Support (under 4h)", included: true },
        { text: "Custom Subdomain (shop.vendornest.com)", included: true },
        { text: "Advanced Sales Analytics", included: true },
        { text: "50 AI Generator Credits / month", included: true },
      ],
    },
    {
      name: "Scale Enterprise",
      monthlyPrice: 79,
      yearlyPrice: 65, // $65 * 12 = $780 / year
      description: "For high-volume merchants demanding ultimate performance.",
      commission: `${rates.enterprise}% platform commission`,
      gradient: "from-zinc-900 to-zinc-950 border-zinc-800 text-white",
      buttonText: "Contact Enterprise",
      buttonHref: "/become-seller",
      features: [
        { text: "Unlimited Product Listings", included: true },
        { text: "Full Custom Branding & CSS", included: true },
        { text: "Stripe Connect + Custom Payouts", included: true },
        { text: "Dedicated Success Manager", included: true },
        { text: "Custom Domain Support (e.g. yourshop.com)", included: true },
        { text: "Real-time Advanced Dashboard", included: true },
        { text: "Unlimited AI Generator Credits", included: true },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-50/50 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Pricing Plans
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Transparent Pricing built to <span className="text-indigo-600">Grow with You</span>
          </h1>
          <p className="text-lg text-zinc-500">
            Choose the perfect tier for your shop. Start free and upgrade anytime as your business expands. No hidden setup fees.
          </p>

          {/* Billing Switcher */}
          <div className="pt-6 flex justify-center">
            <div className="bg-zinc-100 p-1.5 rounded-2xl flex items-center border border-zinc-200 shadow-xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-indigo-650 text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-850"
                }`}
              >
                Yearly Billing
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[9px] font-extrabold uppercase animate-pulse">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((plan, idx) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const billingLabel = price === 0 ? "" : billingCycle === "monthly" ? "/month" : "/month, billed annually";

            return (
              <div
                key={idx}
                className={`border rounded-4xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative bg-linear-to-b ${plan.gradient}`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xs">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-6">
                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">{plan.name}</h3>
                    <p className={`text-xs mt-2 leading-relaxed ${plan.name === "Scale Enterprise" ? "text-zinc-400" : "text-zinc-500"}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight">${price}</span>
                      <span className={`text-xs font-medium ${plan.name === "Scale Enterprise" ? "text-zinc-400" : "text-zinc-500"}`}>
                        {billingLabel}
                      </span>
                    </div>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-wide">
                      ⚡ {plan.commission}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className={`border-t ${plan.name === "Scale Enterprise" ? "border-zinc-800" : "border-zinc-100"}`} />

                  {/* Features List */}
                  <div className="space-y-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Includes:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                          {feat.included ? (
                            <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={feat.included ? "" : "text-zinc-400 line-through"}>{feat.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Button CTA */}
                <div className="pt-8">
                  <Link
                    href={plan.buttonHref}
                    className={`w-full py-3.5 px-6 rounded-2xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                      plan.isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                        : plan.name === "Scale Enterprise"
                        ? "bg-white hover:bg-zinc-150 text-zinc-950"
                        : "bg-zinc-200 hover:bg-zinc-300/80 text-zinc-800"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Detail */}
        <div className="bg-white rounded-4xl border border-zinc-200 p-8 shadow-xs">
          <h3 className="text-xl font-black text-zinc-950 mb-6 tracking-tight text-center sm:text-left">
            Frequently Asked Questions about Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-zinc-900">Are there any setup fees or listing fees?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                No. There are no registration or setup fees. On the Starter plan, you only pay commission when you make a sale. No monthly fixed costs apply.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-zinc-900">Can I change my plan or cancel at any time?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Yes. You can upgrade, downgrade, or cancel your subscription plan directly from your Seller dashboard under Settings. Changes will apply at the start of your next billing cycle.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-zinc-900">How do commission fees get processed?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Commission fees are processed automatically in real-time when checkout transactions are completed via Stripe Connect. The platform fee is deducted before the payout reaches your account.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-zinc-900">What payment processors are supported for seller payouts?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We officially support payouts to Bank accounts, Stripe, Wise, and Payoneer. Configure your preferred payout option inside your shop billing dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
