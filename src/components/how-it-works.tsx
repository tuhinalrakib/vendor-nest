"use client";

import React, { useState } from "react";

interface Step {
  number: string;
  title: string;
  titleBn: string;
  desc: string;
  descBn: string;
  icon: React.ReactNode;
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"seller" | "shopper">("seller");

  const sellerSteps: Step[] = [
    {
      number: "01",
      title: "Open Your Store",
      titleBn: "দোকান খুলুন",
      desc: "Create your merchant account, customize your storefront design, and configure your billing profile in minutes.",
      descBn: "কয়েক মিনিটে আপনার মার্চেন্ট অ্যাকাউন্ট তৈরি করুন, স্টোরফ্রন্ট ডিজাইন কাস্টমাইজ করুন এবং পেমেন্ট গেটওয়ে সেটআপ করুন।",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      number: "02",
      title: "AI Product Catalog",
      titleBn: "AI দিয়ে প্রোডাক্ট লিস্টিং",
      desc: "Use Gemini AI to instantly generate professional descriptions, optimize search tags, and calculate smart dynamic pricing.",
      descBn: "আমাদের বিল্ট-ইন জেমিনি এআই ব্যবহার করে পেশাদার ডেসক্রিপশন তৈরি করুন, সার্চ ট্যাগ অপ্টিমাইজ করুন এবং স্মার্ট প্রাইসিং সেট করুন।",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Start Selling Globally",
      titleBn: "বিশ্বব্যাপী বিক্রি শুরু করুন",
      desc: "Publish your catalog, track shipments, and monitor performance with predictive sales analytics dashboards.",
      descBn: "আপনার প্রোডাক্টগুলো সবার সামনে উন্মুক্ত করুন, অর্ডার শিপমেন্ট ট্র‍্যাক করুন এবং এআই সেলস ফোরকাস্ট ড্যাশবোর্ড উপভোগ করুন।",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M11 20.935V19a2 2 0 012-2h2.87c.76 0 1.39-.56 1.48-1.31l.3-2.69a2 2 0 00-1.28-2.11L14.5 10.5A2 2 0 0113.5 9h-2a2 2 0 01-2-2V4.5a2 2 0 00-2-2H6.93" />
        </svg>
      )
    }
  ];

  const shopperSteps: Step[] = [
    {
      number: "01",
      title: "Browse Storefronts",
      titleBn: "স্টোর ব্রাউজ করুন",
      desc: "Explore verified multi-vendor storefronts containing thousands of high-quality goods across diverse categories.",
      descBn: "আমাদের ভেরিফাইড বিক্রেতাদের ডিজাইন করা আকর্ষণীয় স্টোরফ্রন্টগুলো ঘুরে দেখুন এবং আপনার পছন্দের ক্যাটাগরি ব্রাউজ করুন।",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "AI Recommendations",
      titleBn: "AI রিকমেন্ডেশন দেখুন",
      desc: "Receive smart product recommendations matching your current shopping session, with matching metrics explanation.",
      descBn: "আপনার ব্রাউজিং ও শপিং প্যাটার্ন বুঝে আমাদের এআই রিকমেন্ডেশন ইঞ্জিন আপনাকে একদম মানানসই প্রোডাক্ট সাজেশন দেবে।",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Order Securely",
      titleBn: "নিরাপদে অর্ডার করুন",
      desc: "Add recommended bundles directly to your cart, execute checkout with safe gateways, and track packages live.",
      descBn: "আকর্ষণীয় ডিল ও অফারগুলো কার্ডে যোগ করে সম্পূর্ণ নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে অর্ডার করুন এবং লাইভ ট্র‍্যাক করুন।",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const steps = activeTab === "seller" ? sellerSteps : shopperSteps;

  return (
    <section className="relative py-24 bg-white border-t border-zinc-200/80 overflow-hidden font-sans">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-linear-to-r from-indigo-500/5 to-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            How It Works <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              কিভাবে এটি কাজ করে
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-medium">
            Scale your business as a vendor or enjoy a premium shopping experience as a buyer using the VendorNest platform.
          </p>

          {/* Toggle Switcher */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-full border border-zinc-200/60 mt-4 select-none relative">
            <button
              onClick={() => setActiveTab("seller")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "seller"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              💼 Open Shop (বিক্রেতা)
            </button>
            <button
              onClick={() => setActiveTab("shopper")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "shopper"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              🛍️ Shop Online (ক্রেতা)
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-[2px] bg-dashed-line pointer-events-none opacity-40 z-0">
            <div className="w-full h-full bg-[linear-gradient(to_right,transparent_50%,#e4e4e7_50%)] bg-[length:12px_100%] animate-dash" />
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10 group space-y-5">
              
              {/* Icon Container with step number */}
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-zinc-50 to-white border border-zinc-200/80 shadow-lg flex items-center justify-center text-indigo-600 group-hover:text-white group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:border-transparent transition-all duration-300 group-hover:-translate-y-1">
                  {step.icon}
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-zinc-900 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow">
                  {step.number}
                </div>
              </div>

              {/* Step Text Details */}
              <div className="space-y-2 max-w-sm px-4">
                <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-indigo-600">
                  {step.title} <br className="hidden sm:inline" />
                  <span className="text-xs font-semibold text-zinc-400">({step.titleBn})</span>
                </h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
                <p className="text-[11px] text-zinc-450 leading-relaxed italic bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 group-hover:bg-indigo-50/20 group-hover:border-indigo-100/30 transition-all font-semibold">
                  {step.descBn}
                </p>
              </div>
              
            </div>
          ))}

        </div>

      </div>

      <style>{`
        @keyframes dash {
          to {
            background-position: -24px 0;
          }
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
        .bg-dashed-line {
          background-image: linear-gradient(to right, #cbd5e1 50%, transparent 50%);
          background-size: 15px 2px;
          background-repeat: repeat-x;
        }
      `}</style>
    </section>
  );
}
