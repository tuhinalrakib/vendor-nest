"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import Swal from "sweetalert2";
import api from "@/lib/api";

import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useRouter } from "next/navigation";

interface FlashProduct {
  id: string;
  name: string;
  name_bn?: string;
  description?: string;
  description_bn?: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  soldPercentage: number;
  stockLeft: number;
  image?: string | null;
  icon: string;
  bgGradient: string;
}

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";
  return `${backendHost}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function FlashSaleDeals() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { lang, tp, t } = useLanguage();
  const router = useRouter();

  const [products, setProducts] = useState<FlashProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Timer Countdown state (8 hours, 42 minutes, 15 seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 }; // Reset loop
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fallbackProducts: FlashProduct[] = [
    {
      id: "flash-1",
      name: "Wireless ANC Pro Headphones",
      category: "Electronics",
      originalPrice: 199.0,
      salePrice: 99.0,
      discountPercentage: 50,
      rating: 4.9,
      reviewsCount: 342,
      soldPercentage: 88,
      stockLeft: 6,
      icon: "🎧",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
    },
    {
      id: "flash-2",
      name: "Ultra-HD 4K Smart Watch Series 8",
      category: "Smart Tech",
      originalPrice: 129.0,
      salePrice: 59.0,
      discountPercentage: 54,
      rating: 4.8,
      reviewsCount: 215,
      soldPercentage: 94,
      stockLeft: 3,
      icon: "⌚",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      id: "flash-3",
      name: "Ergonomic Wireless Gaming Mouse",
      category: "Accessories",
      originalPrice: 49.0,
      salePrice: 24.0,
      discountPercentage: 51,
      rating: 4.7,
      reviewsCount: 189,
      soldPercentage: 72,
      stockLeft: 14,
      icon: "🖱️",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      id: "flash-4",
      name: "Smart RGB Atmosphere Desk Lamp",
      category: "Home & Lighting",
      originalPrice: 79.0,
      salePrice: 39.0,
      discountPercentage: 50,
      rating: 4.9,
      reviewsCount: 96,
      soldPercentage: 65,
      stockLeft: 18,
      icon: "💡",
      bgGradient: "from-amber-500/10 to-orange-500/10",
    },
  ];

  useEffect(() => {
    const fetchFlashProducts = async () => {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get("/api/products/"),
          api.get("/api/categories/")
        ]);

        const catMap: { [id: string]: string } = {};
        if (catRes.data) {
          catRes.data.forEach((c: any) => {
            catMap[c.id] = c.name;
          });
        }

        if (prodRes.data && prodRes.data.length > 0) {
          const gradients = [
            "from-indigo-500/10 to-purple-500/10",
            "from-blue-500/10 to-cyan-500/10",
            "from-emerald-500/10 to-teal-500/10",
            "from-amber-500/10 to-orange-500/10",
          ];

          const mapped: FlashProduct[] = prodRes.data.map((p: any, idx: number) => {
            const price = parseFloat(p.price) || 0;
            const rawCompareAt = parseFloat(p.compare_at_price);

            // Dynamic fallback multipliers if compare_at_price is not specified in database
            const fallbackMultipliers = [1.5, 1.35, 1.6, 1.25, 1.45, 1.3];
            const multiplier = fallbackMultipliers[idx % fallbackMultipliers.length];

            const originalPrice = (rawCompareAt && rawCompareAt > price)
              ? rawCompareAt
              : parseFloat((price * multiplier).toFixed(2));

            const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
            const catName = catMap[p.category] || p.category_name || "Featured Product";
            const actualStock = (p.stock !== undefined && p.stock !== null && p.stock > 0) ? p.stock : (5 + ((idx * 7) % 15));

            return {
              id: p.id,
              name: p.name,
              name_bn: p.name_bn,
              description: p.description,
              description_bn: p.description_bn,
              category: catName,
              originalPrice: originalPrice,
              salePrice: price,
              discountPercentage: discountPercentage > 0 ? discountPercentage : 25,
              rating: p.rating || parseFloat((4.5 + (idx % 5) * 0.1).toFixed(1)),
              reviewsCount: p.reviews_count || (45 + idx * 28),
              soldPercentage: Math.min(95, 60 + ((idx * 11) % 30)),
              stockLeft: actualStock,
              image: getImageUrl(p.image),
              icon: "⚡",
              bgGradient: gradients[idx % gradients.length],
            };
          });

          const sorted = mapped.sort((a, b) => b.discountPercentage - a.discountPercentage);
          setProducts(sorted.slice(0, 4));
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.warn("Failed to fetch flash sale products from backend:", err);
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashProducts();
  }, []);

  const displayProducts = products.length > 0 ? products : fallbackProducts;

  const handleClaimDeal = async (prod: FlashProduct) => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please sign in to add items to your shopping cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sign In Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    try {
      await addToCart(prod.id, 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${prod.name} added to cart!`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to add item to cart",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <section className="w-full bg-zinc-50 dark:bg-zinc-950 py-12 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header Bar with Live Countdown Timer */}
        <div className="bg-linear-to-r from-rose-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Title */}
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              ⚡ Limited Time Flash Sale
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Today's Hot Deals & Mega Savings
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-medium max-w-md">
              Hurry! Claim up to 55% OFF on selected verified merchant stock. Deals refresh daily.
            </p>
          </div>

          {/* Right Live Ticking Timer Boxes */}
          <div className="flex items-center gap-2 sm:gap-3 relative z-10 shrink-0 select-none">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90 mr-1 hidden sm:inline">
              Ends In:
            </span>

            {/* Hours Box */}
            <div className="flex flex-col items-center bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-2.5 rounded-2xl min-w-[60px]">
              <span className="text-xl sm:text-2xl font-black leading-none">
                {formatNumber(timeLeft.hours)}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/70 mt-1">Hours</span>
            </div>
            <span className="text-xl font-black text-white/80">:</span>

            {/* Minutes Box */}
            <div className="flex flex-col items-center bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-2.5 rounded-2xl min-w-[60px]">
              <span className="text-xl sm:text-2xl font-black leading-none">
                {formatNumber(timeLeft.minutes)}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/70 mt-1">Mins</span>
            </div>
            <span className="text-xl font-black text-white/80">:</span>

            {/* Seconds Box */}
            <div className="flex flex-col items-center bg-rose-500 text-white border border-rose-400 px-3.5 py-2.5 rounded-2xl min-w-[60px] shadow-md animate-pulse">
              <span className="text-xl sm:text-2xl font-black leading-none">
                {formatNumber(timeLeft.seconds)}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-100 mt-1">Secs</span>
            </div>
          </div>

        </div>

        {/* 4 Flash Deal Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative group hover:-translate-y-1"
            >
              
              {/* Discount Percentage Badge */}
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                -{prod.discountPercentage}% OFF
              </span>

              {/* Product Visual Mockup */}
              <div className={`w-full aspect-square rounded-2xl bg-linear-to-br ${prod.bgGradient} border border-zinc-100 dark:border-zinc-800/80 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <span className="text-6xl drop-shadow-md">{prod.icon}</span>
                    <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-2">
                      {prod.category}
                    </span>
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="mt-4 space-y-3 text-left">
                {/* Title & Rating */}
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-950 dark:text-zinc-50 leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tp({ name: prod.name, name_bn: prod.name_bn }, "name")}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-amber-500">★ {prod.rating}</span>
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                      ({prod.reviewsCount} {lang === "bn" ? "রিভিউ" : "reviews"})
                    </span>
                  </div>
                </div>

                {/* Price Slash Comparison: Original vs Deal Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                    ${prod.salePrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 line-through">
                    ${prod.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Stock Progress Bar (Urgency Meter) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-extrabold">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {prod.soldPercentage}% {lang === "bn" ? "সংগৃহীত" : "Claimed"}
                    </span>
                    <span className="text-rose-600 dark:text-rose-400">
                      {lang === "bn" ? `মজুদ আছে ${prod.stockLeft} টি!` : `Only ${prod.stockLeft} left!`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-amber-500 to-rose-600 transition-all duration-500"
                      style={{ width: `${prod.soldPercentage}%` }}
                    />
                  </div>
                </div>

                {/* CTA Claim Deal Button */}
                <button
                  onClick={() => handleClaimDeal(prod)}
                  className="w-full h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>⚡ {lang === "bn" ? "অফারটি নিন" : "Claim Deal"}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
