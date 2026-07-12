"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

export default function SellerFAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("getting-started");
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first question by default
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories: FAQCategory[] = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      items: [
        {
          question: "How do I sign up as a seller on VendorNest?",
          answer: "Signing up is simple! Click on 'Become a Seller' in the footer, fill out your shop details (shop name, description, business credentials), and submit. Once verified by our administrators, your shop will go live."
        },
        {
          question: "What is Stripe Connect and why do I need it?",
          answer: "Stripe Connect is our secure payment splitter system. Setting it up links your bank account to the VendorNest marketplace, enabling you to receive payouts automatically in real-time when customers buy your products."
        },
        {
          question: "Can I choose my own subdomain name?",
          answer: "Yes! During signup, you can configure your own unique shop subdomain (e.g., yourname.vendornest.com). Growth and Scale plan users also have the option to map their custom external domain names (e.g. www.yourshop.com) to their storefront."
        }
      ]
    },
    {
      id: "shop-management",
      name: "Shop & Products",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      items: [
        {
          question: "How do I list new products in my store?",
          answer: "Log in to your Seller Dashboard, go to 'Add Product', input your product title, features, pricing, stock levels, and upload images. Once saved, it will instantly display on your custom store subdomain and the main marketplace catalog."
        },
        {
          question: "Is there a limit on how many products I can list?",
          answer: "On our Free Starter plan, you can list up to 15 active products at a time. Upgrading to our Growth or Scale plans grants you unlimited product listings."
        },
        {
          question: "How does stock and inventory management work?",
          answer: "Each product has a 'stock' count. When a customer purchases a product, the inventory is automatically decremented. If stock reaches zero, the product card updates to show 'Out of Stock' and disables the purchase CTA."
        }
      ]
    },
    {
      id: "payments-payouts",
      name: "Payments & Payouts",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      items: [
        {
          question: "How often do I get paid?",
          answer: "Payout schedules depend on your billing setup and verification tier. Verified merchants using Stripe Connect typically receive payouts in real-time directly to their bank accounts or within a 2-day rolling window."
        },
        {
          question: "What currencies are supported on the platform?",
          answer: "We support USD, BDT, EUR, and GBP for checkout. Payouts can be converted to your local currency automatically via Stripe conversion or paid directly through Wise/Payoneer wire transfers."
        },
        {
          question: "How does VendorNest collect platform fees?",
          answer: "Platform commissions (e.g. 5% on Starter, 2% on Growth, 0.5% on Scale) are deducted in real-time at the moment of checkout transaction. You receive your payout net of the platform commission and standard stripe payment fees."
        }
      ]
    },
    {
      id: "ai-features",
      name: "AI & Marketing Tools",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      items: [
        {
          question: "How does the AI Product Description generator work?",
          answer: "When adding a product, enter the name, select category, and list a few keywords/features. Click 'Generate Description', and our built-in Gemini AI model will write an engaging, professional, and SEO-friendly description for your item."
        },
        {
          question: "What is the AI SEO metadata generator?",
          answer: "It scans your product name and description to automatically generate optimized SEO Meta Titles and meta descriptions, maximizing your shop's visibility on Google and Bing search results."
        },
        {
          question: "Are there limits on AI content generation?",
          answer: "Growth plan users receive 50 AI Generator credits per month, while Scale plan users enjoy unlimited AI credits. Starter plan users can generate description mockups but need to write custom copy or upgrade to unlock full API capabilities."
        }
      ]
    }
  ];

  // Search logic
  const allMatchedFAQs = categories.reduce<{ categoryId: string; categoryName: string; item: FAQItem }[]>((acc, cat) => {
    cat.items.forEach((item) => {
      const qMatch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
      const aMatch = item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      if (qMatch || aMatch) {
        acc.push({ categoryId: cat.id, categoryName: cat.name, item });
      }
    });
    return acc;
  }, []);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setOpenIndex(0); // Reset first item open on category change
    setSearchQuery(""); // Clear search query to restore category view
  };

  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  return (
    <div className="w-full min-h-screen bg-zinc-50/50 py-16 font-sans">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Resources & Documentation
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
            How can we <span className="text-indigo-600">help you sell?</span>
          </h1>
          <p className="text-sm text-zinc-500">
            Find answers to frequently asked questions about setting up your shop, listing products, configure payouts, and marketing tools.
          </p>

          {/* Search box */}
          <div className="pt-4 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search guides, payments, shipping, AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500 shadow-xs"
            />
            <svg className="w-4.5 h-4.5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs - Categories (Hidden on mobile dropdown maybe but here layout lists cleanly) */}
          <div className="md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all shrink-0 w-auto md:w-full text-left cursor-pointer border ${
                  activeCategory === cat.id && !searchQuery
                    ? "bg-indigo-600 border-indigo-650 text-white shadow-xs"
                    : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950"
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* FAQ Accordion Details Panel */}
          <div className="md:col-span-8 space-y-4">
            {searchQuery ? (
              // Search Results list
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-left">
                  Search Results ({allMatchedFAQs.length})
                </h3>
                {allMatchedFAQs.length > 0 ? (
                  allMatchedFAQs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-zinc-200 rounded-2xl p-5 text-left transition-all hover:border-zinc-300"
                    >
                      <span className="inline-block text-[9px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md mb-2">
                        {faq.categoryName}
                      </span>
                      <h4 className="text-sm font-extrabold text-zinc-950">{faq.item.question}</h4>
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{faq.item.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center text-zinc-500">
                    <p className="text-sm font-medium">No guides matched "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Standard Category list with Accordion
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-left">
                  {activeCategoryData?.name} Guides
                </h3>

                {activeCategoryData?.items.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`bg-white border rounded-2xl text-left overflow-hidden transition-all duration-300 ${
                        isOpen ? "border-indigo-300 ring-1 ring-indigo-350" : "border-zinc-200"
                      }`}
                    >
                      {/* Accordion header button */}
                      <button
                        onClick={() => handleToggle(idx)}
                        className="w-full p-5 flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 cursor-pointer"
                      >
                        <span className="text-left font-black tracking-tight">{item.question}</span>
                        <svg
                          className={`w-4.5 h-4.5 text-zinc-400 transition-transform duration-300 shrink-0 ${
                            isOpen ? "rotate-180 text-indigo-600" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Accordion collapsible body */}
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpen ? "max-h-[300px] border-t border-zinc-100" : "max-h-0"
                        }`}
                      >
                        <p className="p-5 text-xs text-zinc-500 leading-relaxed bg-zinc-50/50">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CTA Contact Footer banner */}
        <div className="mt-16 bg-linear-to-tr from-indigo-650 to-violet-650 rounded-4xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent pointer-events-none" />
          <div className="space-y-4 max-w-xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Need direct technical assistance?</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              If you couldn't find the answers you're looking for, or if you have enterprise account questions, please contact our merchant onboarding team. We're here to help you build your business.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-indigo-700 text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Contact Merchant Support
              </Link>
              <Link
                href="/become-seller"
                className="px-6 py-3 rounded-2xl bg-indigo-600/50 hover:bg-indigo-600/80 text-white text-xs font-black border border-indigo-400 transition-all active:scale-95 cursor-pointer"
              >
                Apply as Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
