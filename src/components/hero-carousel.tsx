"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface PopularCategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";
  return `${backendHost}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const getCategoryIcon = (catName: string) => {
  const nameLower = catName.toLowerCase();
  if (nameLower.includes("elect") || nameLower.includes("tech") || nameLower.includes("phone") || nameLower.includes("comp")) return "💻";
  if (nameLower.includes("fash") || nameLower.includes("cloth") || nameLower.includes("wear") || nameLower.includes("shoe") || nameLower.includes("jewel")) return "👕";
  if (nameLower.includes("home") || nameLower.includes("kitc") || nameLower.includes("furn") || nameLower.includes("liv")) return "🛋️";
  if (nameLower.includes("beaut") || nameLower.includes("health")) return "✨";
  if (nameLower.includes("sport") || nameLower.includes("fit")) return "⚽";
  return "📦";
};

interface Slide {
  id: string;
  badge: string;
  badgeBg: string;
  title: string;
  highlightText: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  discountTag?: string;
  gradient: string;
  imageBgGradient: string;
  iconSvg: React.ReactNode;
  floatingWidgetTitle: string;
  floatingWidgetValue: string;
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [popularCategories, setPopularCategories] = useState<PopularCategoryItem[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await api.get("/api/categories/");
        if (response.data && response.data.length > 0) {
          setPopularCategories(response.data.slice(0, 3));
        }
      } catch (err) {
        console.warn("Failed to fetch popular categories from backend:", err);
      }
    };

    fetchPopularCategories();
  }, []);

  const displayCategories = popularCategories.length > 0 ? popularCategories : [
    { id: "electronics", name: "Tech", slug: "electronics", image: null },
    { id: "clothing", name: "Fashion", slug: "fashion", image: null },
    { id: "home", name: "Home", slug: "home", image: null },
  ];

  const slides: Slide[] = [
    {
      id: "slide-1",
      badge: "🔥 Super Tech Deals • Up to 40% OFF",
      badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      title: "Upgrade Your Lifestyle With",
      highlightText: "Next-Gen Tech & Gadgets",
      subtitle: "Discover high-performance smart devices, active noise-canceling audio, and verified merchant electronics with instant global dispatch.",
      primaryCtaText: "Shop Tech Deals",
      primaryCtaLink: "/products?category=electronics",
      secondaryCtaText: "Browse Stores",
      secondaryCtaLink: "/shops",
      discountTag: "SAVE UP TO $150",
      gradient: "from-indigo-600 via-purple-600 to-indigo-700",
      imageBgGradient: "from-indigo-500/20 to-purple-500/20",
      iconSvg: (
        <svg className="w-20 h-20 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      floatingWidgetTitle: "Top Rated Tech",
      floatingWidgetValue: "4.9 ★ (1,280+ Reviews)",
    },
    {
      id: "slide-2",
      badge: "✨ Summer Fashion Collection",
      badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      title: "Express Your Style With",
      highlightText: "Premium Designer Apparel",
      subtitle: "Explore handcrafted apparel, footwear, and accessories from certified boutique storefronts worldwide.",
      primaryCtaText: "Explore Fashion",
      primaryCtaLink: "/products?category=clothing",
      secondaryCtaText: "View Featured Brands",
      secondaryCtaLink: "/shops",
      discountTag: "FLAT 30% OFF",
      gradient: "from-rose-600 via-pink-600 to-purple-600",
      imageBgGradient: "from-rose-500/20 to-pink-500/20",
      iconSvg: (
        <svg className="w-20 h-20 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      floatingWidgetTitle: "Hot Release",
      floatingWidgetValue: "Limited Stock Item",
    },
    {
      id: "slide-3",
      badge: "🏷️ Merchant Coupons & Vouchers",
      badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      title: "Clip Coupons & Unlock",
      highlightText: "Instant Order Savings",
      subtitle: "Save instantly at checkout by claiming direct merchant discount vouchers and platform promotional offers.",
      primaryCtaText: "Claim Coupons",
      primaryCtaLink: "/coupons",
      secondaryCtaText: "Special Offers",
      secondaryCtaLink: "/products",
      discountTag: "INSTANT DISCOUNTS",
      gradient: "from-emerald-600 via-teal-600 to-indigo-600",
      imageBgGradient: "from-emerald-500/20 to-teal-500/20",
      iconSvg: (
        <svg className="w-20 h-20 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" />
        </svg>
      ),
      floatingWidgetTitle: "Coupon Clip Rate",
      floatingWidgetValue: "Over 5,000 Clipped Today",
    },
    {
      id: "slide-4",
      badge: "🚀 Sell Globally On VendorNest",
      badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      title: "Launch & Grow Your Own",
      highlightText: "Multi-Vendor Storefront",
      subtitle: "Build your online business with automated AI product description generators, custom subdomain branding, and automated payouts.",
      primaryCtaText: "Open Your Store",
      primaryCtaLink: "/become-seller",
      secondaryCtaText: "View Merchant Plans",
      secondaryCtaLink: "/seller/pricing",
      discountTag: "ZERO SETUP FEE",
      gradient: "from-indigo-600 via-blue-600 to-violet-600",
      imageBgGradient: "from-blue-500/20 to-indigo-500/20",
      iconSvg: (
        <svg className="w-20 h-20 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V10m0 0V5m0 5h4" />
        </svg>
      ),
      floatingWidgetTitle: "Seller Payout SLA",
      floatingWidgetValue: "Real-time Stripe Split",
    },
  ];

  // Auto-play timer effect (Infinite Loop every 5 seconds)
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full bg-zinc-50 dark:bg-zinc-950 pt-6 pb-12 font-sans overflow-hidden transition-colors duration-300 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid Container: Carousel Banner (Left) + Quick Deals Widgets (Right on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Carousel Slider Card (8 Cols on Desktop) */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl min-h-[440px] flex flex-col justify-between group">
            
            {/* Top 5s Timer Progress Line (Infinite Loop) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 overflow-hidden z-20">
              <div
                key={currentSlide}
                className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 animate-[progress_5s_linear]"
                style={{
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              />
            </div>
            
            {/* Background Decorative Ambient Radial Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Slide Content Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 my-auto">
              
              {/* Left Column: Text & CTAs */}
              <div className="sm:col-span-7 space-y-5 text-left">
                {/* Badge Tag */}
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${slide.badgeBg}`}>
                  {slide.badge}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
                    {slide.title} <br />
                    <span className={`bg-linear-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                      {slide.highlightText}
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium line-clamp-3">
                    {slide.subtitle}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={slide.primaryCtaLink}
                    className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md hover:shadow-indigo-600/20 transition-all flex items-center justify-center cursor-pointer"
                  >
                    {slide.primaryCtaText} →
                  </Link>
                  <Link
                    href={slide.secondaryCtaLink}
                    className="h-11 px-5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs border border-zinc-200 dark:border-zinc-700 transition-all flex items-center justify-center cursor-pointer"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Visual Card & Floating Tag */}
              <div className="sm:col-span-5 relative flex items-center justify-center pt-4 sm:pt-0">
                <div className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-linear-to-br ${slide.imageBgGradient} border border-white/60 dark:border-zinc-800 backdrop-blur-md flex flex-col items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform duration-500`}>
                  {/* Floating Discount Tag */}
                  {slide.discountTag && (
                    <span className="absolute -top-3 px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                      {slide.discountTag}
                    </span>
                  )}
                  {slide.iconSvg}
                  
                  {/* Floating Bottom Label */}
                  <div className="absolute -bottom-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl shadow-md text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{slide.floatingWidgetTitle}</p>
                    <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{slide.floatingWidgetValue}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Carousel Bottom Control Bar */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between relative z-10 mt-6">
              
              {/* Slide Indicators Dots */}
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? "w-8 bg-indigo-600" : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer border border-zinc-200 dark:border-zinc-700"
                  aria-label="Previous Slide"
                >
                  ←
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer border border-zinc-200 dark:border-zinc-700"
                  aria-label="Next Slide"
                >
                  →
                </button>
              </div>

            </div>

          </div>

          {/* Quick Deals & Category Navigation Tiles (4 Cols on Desktop - Amazon/Alibaba Style) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Tile 1: Top Categories Quick Access */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                  📁 Popular Categories
                </span>
                <Link href="/categories" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {displayCategories.map((cat) => {
                  const imgUrl = getImageUrl(cat.image);
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${encodeURIComponent(cat.id)}`}
                      className="p-3 bg-zinc-50 dark:bg-zinc-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl text-center transition-all group flex flex-col items-center justify-center min-h-[76px]"
                    >
                      {imgUrl ? (
                        <div className="w-7 h-7 relative rounded-lg overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                          <img
                            src={imgUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <p className="text-xl group-hover:scale-110 transition-transform leading-none">
                          {getCategoryIcon(cat.name)}
                        </p>
                      )}
                      <p className="text-[10px] font-extrabold text-zinc-700 dark:text-zinc-300 mt-1.5 truncate max-w-full">
                        {cat.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tile 2: Instant Seller Onboarding Card */}
            <div className="bg-linear-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="space-y-1 relative z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                  🚀 Merchant Hub
                </span>
                <h3 className="text-base font-extrabold tracking-tight pt-1">
                  Start Selling Globally
                </h3>
                <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                  Create your store in under 2 minutes with AI description generators & zero setup fee.
                </p>
              </div>
              <div className="pt-2 relative z-10 flex gap-2">
                <Link
                  href="/become-seller"
                  className="w-full h-10 bg-white text-indigo-950 hover:bg-zinc-100 rounded-xl text-xs font-black flex items-center justify-center shadow-md transition-all cursor-pointer"
                >
                  Register Store Now
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
