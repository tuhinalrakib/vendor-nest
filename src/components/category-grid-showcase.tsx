"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

const getCategoryIcon = (catName: string) => {
  const nameLower = catName.toLowerCase();
  if (nameLower.includes("elect") || nameLower.includes("tech") || nameLower.includes("phone") || nameLower.includes("comp")) return "💻";
  if (nameLower.includes("fash") || nameLower.includes("cloth") || nameLower.includes("wear") || nameLower.includes("shoe") || nameLower.includes("jewel")) return "👗";
  if (nameLower.includes("home") || nameLower.includes("kitc") || nameLower.includes("furn") || nameLower.includes("liv")) return "🛋️";
  if (nameLower.includes("beaut") || nameLower.includes("health")) return "✨";
  if (nameLower.includes("gadget") || nameLower.includes("smart")) return "⚡";
  return "🏷️";
};

interface GridItem {
  id: string;
  name: string;
  price: string;
  badge?: string;
  icon: string;
  bgGradient: string;
  link: string;
}

interface CollectionCard {
  id: string;
  categorySlug: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  exploreLink: string;
  items: GridItem[];
}

export default function CategoryGridShowcase() {
  const { t, tp, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dbCategories, setDbCategories] = useState<{ id: string; label: string; icon: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories/");
        const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((cat: any) => ({
            id: cat.slug || cat.id,
            label: tp(cat, "name"),
            icon: getCategoryIcon(cat.name),
          }));
          setDbCategories(mapped);
        }
      } catch (err) {
        console.warn("Failed to load categories for grid showcase", err);
      }
    };
    fetchCategories();
  }, [lang]);

  const categories = [
    { id: "all", label: t("categoryGrid.allCategories"), icon: "🌐" },
    ...dbCategories,
  ];

  const collections: CollectionCard[] = [
    {
      id: "electronics-grid",
      categorySlug: "electronics",
      title: lang === "bn" ? "ইলেকট্রনিক্সে সেরা পণ্যসমূহ" : "Best Sellers in Electronics",
      subtitle: lang === "bn" ? "সেরা টেক ও স্মার্ট ডিভাইস" : "Top-rated tech & smart audio devices",
      badge: lang === "bn" ? "হট ডিলস" : "HOT DEALS",
      badgeBg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      exploreLink: "/products?category=electronics",
      items: [
        { id: "e1", name: lang === "bn" ? "স্মার্ট ওয়াচ" : "Smart Watches", price: lang === "bn" ? "মাত্র ৳৮৯" : "From $89", badge: "-25%", icon: "⌚", bgGradient: "from-blue-500/10 to-indigo-500/10", link: "/products?category=electronics" },
        { id: "e2", name: lang === "bn" ? "হেডফোন" : "ANC Headphones", price: lang === "bn" ? "মাত্র ৳১২৯" : "From $129", badge: lang === "bn" ? "সেরা" : "Best", icon: "🎧", bgGradient: "from-purple-500/10 to-indigo-500/10", link: "/products?category=electronics" },
        { id: "e3", name: lang === "bn" ? "স্পিকার" : "Surround Speakers", price: lang === "bn" ? "মাত্র ৳৭৯" : "From $79", icon: "🔊", bgGradient: "from-indigo-500/10 to-cyan-500/10", link: "/products?category=electronics" },
        { id: "e4", name: lang === "bn" ? "ফাস্ট চার্জার" : "Fast Chargers", price: lang === "bn" ? "মাত্র ৳১৯" : "From $19", badge: lang === "bn" ? "হট" : "Hot", icon: "🔌", bgGradient: "from-sky-500/10 to-blue-500/10", link: "/products?category=electronics" },
      ],
    },
    {
      id: "fashion-grid",
      categorySlug: "fashion",
      title: lang === "bn" ? "ট্রেন্ডিং ফ্যাশন ও পোশাক" : "Trending Fashion & Apparel",
      subtitle: lang === "bn" ? "সিজনাল পোশাক ও বুটিক কালেকশন" : "Curated seasonal apparel & boutique wear",
      badge: lang === "bn" ? "নতুন কালেকশন" : "NEW ARRIVALS",
      badgeBg: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
      exploreLink: "/products?category=clothing",
      items: [
        { id: "f1", name: lang === "bn" ? "সামার ড্রেস" : "Summer Dresses", price: lang === "bn" ? "৳৪৫ এর মধ্যে" : "Under $45", badge: lang === "bn" ? "নতুন" : "New", icon: "👗", bgGradient: "from-rose-500/10 to-pink-500/10", link: "/products?category=clothing" },
        { id: "f2", name: lang === "bn" ? "স্নির্কার্স" : "Casual Sneakers", price: lang === "bn" ? "মাত্র ৳৫৯" : "From $59", badge: lang === "bn" ? "টপ" : "Top", icon: "👟", bgGradient: "from-pink-500/10 to-purple-500/10", link: "/products?category=clothing" },
        { id: "f3", name: lang === "bn" ? "লেদার ব্যাগ" : "Leather Handbags", price: lang === "bn" ? "৳৮৯ এর মধ্যে" : "Under $89", icon: "👜", bgGradient: "from-amber-500/10 to-rose-500/10", link: "/products?category=clothing" },
        { id: "f4", name: lang === "bn" ? "ডিজাইনার গ্লাস" : "Designer Eyewear", price: lang === "bn" ? "মাত্র ৳২৯" : "From $29", badge: lang === "bn" ? "ট্রেন্ডিং" : "Trending", icon: "🕶️", bgGradient: "from-violet-500/10 to-pink-500/10", link: "/products?category=clothing" },
      ],
    },
    {
      id: "home-grid",
      categorySlug: "home",
      title: lang === "bn" ? "হোম ও কিচেন আইটেম" : "Home & Kitchen Comforts",
      subtitle: lang === "bn" ? "ঘরের নিত্যপ্রয়োজনীয় চমৎকার উপাদান" : "Essentials to elevate your daily living space",
      badge: lang === "bn" ? "৩৫% পর্যন্ত ছাড়" : "UP TO 35% OFF",
      badgeBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      exploreLink: "/products?category=home",
      items: [
        { id: "h1", name: lang === "bn" ? "স্মার্ট এয়ার ফ্রায়ার" : "Smart Air Fryers", price: lang === "bn" ? "মাত্র ৳৬৯" : "From $69", badge: lang === "bn" ? "৩০% ছাড়" : "Save 30%", icon: "🍳", bgGradient: "from-amber-500/10 to-orange-500/10", link: "/products?category=home" },
        { id: "h2", name: lang === "bn" ? "RGB লাইট" : "RGB Ambient Lights", price: lang === "bn" ? "৳৩৫ এর নিচে" : "Under $35", icon: "💡", bgGradient: "from-yellow-500/10 to-amber-500/10", link: "/products?category=home" },
        { id: "h3", name: lang === "bn" ? "চেয়ার" : "Ergonomic Chairs", price: lang === "bn" ? "মাত্র ৳১৪৯" : "From $149", badge: lang === "bn" ? "জনপ্রিয়" : "Popular", icon: "🪑", bgGradient: "from-emerald-500/10 to-teal-500/10", link: "/products?category=home" },
        { id: "h4", name: lang === "bn" ? "কুশন" : "Velvet Cushions", price: lang === "bn" ? "৳২৫ এর নিচে" : "Under $25", icon: "🛋️", bgGradient: "from-teal-500/10 to-cyan-500/10", link: "/products?category=home" },
      ],
    },
    {
      id: "savers-grid",
      categorySlug: "gadgets",
      title: lang === "bn" ? "৫০ ডলারের নিচে সেরা অফার" : "Super Savers Under $50",
      subtitle: lang === "bn" ? "বাজেট ফ্রেন্ডলি ডিলস" : "High-value deals & budget-friendly picks",
      badge: lang === "bn" ? "ফ্ল্যাশ অফার" : "FLASH OFFERS",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      exploreLink: "/coupons",
      items: [
        { id: "s1", name: lang === "bn" ? "ফিটনেস ব্যান্ড" : "Fitness Bands", price: lang === "bn" ? "মাত্র ৳২৯" : "Only $29", badge: lang === "bn" ? "৳৩০ নিচে" : "Under $30", icon: "⌚", bgGradient: "from-emerald-500/10 to-green-500/10", link: "/coupons" },
        { id: "s2", name: lang === "bn" ? "ব্লুটুথ স্পিকার" : "Mini Bluetooth Speaker", price: lang === "bn" ? "মাত্র ৳২৪" : "Only $24", icon: "📻", bgGradient: "from-teal-500/10 to-emerald-500/10", link: "/coupons" },
        { id: "s3", name: lang === "bn" ? "পাওয়ার স্ট্রিপ" : "Desk Power Strip", price: lang === "bn" ? "মাত্র ৳১৮" : "Only $18", badge: lang === "bn" ? "বেস্টসেলার" : "Bestseller", icon: "⚡", bgGradient: "from-cyan-500/10 to-blue-500/10", link: "/coupons" },
        { id: "s4", name: lang === "bn" ? "নেক ফ্যান" : "Portable Neck Fan", price: lang === "bn" ? "মাত্র ৳১৫" : "Only $15", icon: "🌀", bgGradient: "from-blue-500/10 to-indigo-500/10", link: "/coupons" },
      ],
    },
  ];

  const filteredCollections = activeTab === "all"
    ? collections
    : collections.filter((c) => c.categorySlug === activeTab || activeTab === "gadgets" || activeTab === "beauty");

  return (
    <section className="w-full bg-zinc-50 dark:bg-zinc-950 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Top Header & Filter Bar (Alibaba Style) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 mb-2">
              {t("categoryGrid.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
              {t("categoryGrid.title")}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              {t("categoryGrid.subtitle")}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  activeTab === cat.id
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Showcase Grid (Amazon / Alibaba Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${col.badgeBg}`}>
                    {col.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {col.title}
                </h3>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
                  {col.subtitle}
                </p>
              </div>

              {/* 2x2 Sub-item Visual Grid (4 Thumbnails per Card) */}
              <div className="grid grid-cols-2 gap-3 my-2">
                {col.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className={`p-3 rounded-2xl bg-linear-to-br ${item.bgGradient} border border-zinc-100 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 flex flex-col items-center text-center justify-between relative group/item transition-all hover:scale-105`}
                  >
                    {/* Badge if present */}
                    {item.badge && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded-md uppercase">
                        {item.badge}
                      </span>
                    )}

                    {/* Icon visual */}
                    <div className="text-3xl my-2 group-hover/item:scale-110 transition-transform">
                      {item.icon}
                    </div>

                    {/* Item Text & Price */}
                    <div className="w-full">
                      <p className="text-[11px] font-extrabold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {item.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <Link
                  href={col.exploreLink}
                  className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between group/link"
                >
                  <span>{t("categoryGrid.exploreCollection")}</span>
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
