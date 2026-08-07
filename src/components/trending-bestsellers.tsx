"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import Swal from "sweetalert2";
import { useLanguage } from "@/lib/LanguageContext";

interface ProductItem {
  id: string;
  name: string;
  name_bn?: string;
  description?: string;
  description_bn?: string;
  price: string;
  compare_at_price?: string | null;
  seller_shop?: string;
  rating?: number;
  reviews_count?: number;
  image?: string | null;
  badge?: string;
  category?: string;
}

export default function TrendingBestSellers() {
  const { addToCart } = useCart();
  const { lang, tp, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"bestsellers" | "new" | "rated">("bestsellers");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback items if API is empty or loading
  const fallbackProducts: Record<"bestsellers" | "new" | "rated", ProductItem[]> = {
    bestsellers: [
      { id: "bs-1", name: "AuraLink Wireless Earbuds Pro", price: "79.00", compare_at_price: "119.00", seller_shop: "AuraLink Official", rating: 4.9, reviews_count: 512, badge: "#1 Best Seller", category: "Electronics" },
      { id: "bs-2", name: "Apex Minimalist Leather Sneakers", price: "95.00", compare_at_price: "140.00", seller_shop: "Apex Apparel", rating: 4.8, reviews_count: 284, badge: "Top Rated", category: "Fashion" },
      { id: "bs-3", name: "SaddleCraft Genuine Leather Wallet", price: "45.00", compare_at_price: "65.00", seller_shop: "SaddleCraft Co.", rating: 4.9, reviews_count: 390, badge: "Popular", category: "Accessories" },
      { id: "bs-4", name: "Ultra-Slim Mechanical Keyboard", price: "110.00", compare_at_price: "150.00", seller_shop: "TechHaven Shop", rating: 4.7, reviews_count: 198, badge: "#1 Tech Pick", category: "Electronics" },
      { id: "bs-5", name: "Smart Ergonomic Desk Chair", price: "220.00", compare_at_price: "299.00", seller_shop: "ComfortSpaces", rating: 4.9, reviews_count: 420, badge: "Best Seller", category: "Home" },
      { id: "bs-6", name: "Organic Lavender Scented Candle Set", price: "28.00", compare_at_price: "38.00", seller_shop: "Aura Home", rating: 4.8, reviews_count: 156, badge: "Trending", category: "Living" },
      { id: "bs-7", name: "Multi-Port 100W GaN Fast Charger", price: "49.00", compare_at_price: "69.00", seller_shop: "PowerPulse Tech", rating: 4.9, reviews_count: 670, badge: "Must-Have", category: "Electronics" },
      { id: "bs-8", name: "Polarized Retro Sunglasses", price: "35.00", compare_at_price: "55.00", seller_shop: "Urban Optix", rating: 4.7, reviews_count: 210, badge: "Hot Item", category: "Fashion" },
    ],
    new: [
      { id: "nw-1", name: "Next-Gen Smart Fitness Ring", price: "149.00", compare_at_price: "189.00", seller_shop: "VitalTech Labs", rating: 5.0, reviews_count: 42, badge: "Just Released", category: "Smart Tech" },
      { id: "nw-2", name: "Oversized Heavyweight Cotton Hoodie", price: "68.00", compare_at_price: "85.00", seller_shop: "StreetVibe Apparel", rating: 4.9, reviews_count: 29, badge: "New Release", category: "Fashion" },
      { id: "nw-3", name: "Portable Espresso Coffee Maker", price: "89.00", compare_at_price: "115.00", seller_shop: "BrewCraft Goods", rating: 4.8, reviews_count: 65, badge: "New Drop", category: "Home" },
      { id: "nw-4", name: "Modular Magnetic Powerbank", price: "55.00", compare_at_price: "75.00", seller_shop: "PowerPulse Tech", rating: 4.9, reviews_count: 51, badge: "New Innovation", category: "Electronics" },
    ],
    rated: [
      { id: "rt-1", name: "Master Studio Noise Canceling Headset", price: "249.00", compare_at_price: "320.00", seller_shop: "AuraLink Official", rating: 5.0, reviews_count: 840, badge: "5.0 ★ Rating", category: "Audio" },
      { id: "rt-2", name: "Handcrafted Italian Leather Duffle", price: "195.00", compare_at_price: "260.00", seller_shop: "SaddleCraft Co.", rating: 4.9, reviews_count: 430, badge: "Customer Choice", category: "Bags" },
      { id: "rt-3", name: "Automatic Smart Air Purifier 3D", price: "135.00", compare_at_price: "180.00", seller_shop: "CleanAir Home", rating: 4.9, reviews_count: 610, badge: "Verified 5.0", category: "Home" },
      { id: "rt-4", name: "Pro Cinema 4K Mini Projector", price: "299.00", compare_at_price: "399.00", seller_shop: "TechHaven Shop", rating: 4.9, reviews_count: 320, badge: "Highest Rated", category: "Electronics" },
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products/");
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map((p: any, idx: number) => ({
            id: p.id || `api-${idx}`,
            name: p.name,
            name_bn: p.name_bn,
            description: p.description,
            description_bn: p.description_bn,
            price: p.price,
            compare_at_price: p.compare_at_price,
            seller_shop: p.seller_shop || "Verified Merchant",
            rating: p.rating || parseFloat((4.6 + Math.random() * 0.4).toFixed(1)),
            reviews_count: Math.floor(50 + Math.random() * 300),
            image: p.image || null,
            badge: idx % 2 === 0 ? "Best Seller" : "Trending",
          }));
          setProducts(formatted);
        } else {
          setProducts(fallbackProducts[activeTab]);
        }
      } catch (err) {
        setProducts(fallbackProducts[activeTab]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  const displayedProducts = products.length > 0 ? products : fallbackProducts[activeTab];

  const handleAddToCart = async (item: ProductItem) => {
    try {
      await addToCart(item.id, 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${item.name} added to cart!`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please login to add items to cart",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-16 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header Bar with Filter Tabs (Amazon Style) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 mb-2">
              ⭐ Top Selling Marketplace Products
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
              Trending & Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
              Explore most popular items bought by retail shoppers across our merchant network.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "bestsellers"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              🔥 Best Sellers
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "new"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              ✨ New Arrivals
            </button>
            <button
              onClick={() => setActiveTab("rated")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "rated"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              ⭐ Highest Rated
            </button>
          </div>
        </div>

        {/* 4-Column Amazon Style Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 relative group hover:-translate-y-1"
            >
              {/* Product Top Badge */}
              {prod.badge && (
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {prod.badge}
                </span>
              )}

              {/* Product Visual Container */}
              <div className="w-full aspect-square rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-transform duration-300">
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold">
                    🛍️
                  </div>
                )}
              </div>

              {/* Product Content Details */}
              <div className="mt-4 space-y-3 text-left">
                {/* Seller Shop Badge */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>🏪</span>
                  <span className="truncate">{prod.seller_shop}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-extrabold text-zinc-950 dark:text-zinc-50 leading-snug line-clamp-2 min-h-[40px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tp({ name: prod.name, name_bn: prod.name_bn }, "name")}
                </h3>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.floor(prod.rating || 5)
                          ? "text-amber-400 fill-amber-400"
                          : "text-zinc-300 dark:text-zinc-700 fill-current"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 ml-1">
                    {prod.rating || 4.9} ({prod.reviews_count || 128})
                  </span>
                </div>

                {/* Price & Struck Comparison */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-lg font-black text-zinc-950 dark:text-zinc-50">
                    ${parseFloat(prod.price).toFixed(2)}
                  </span>
                  {prod.compare_at_price && (
                    <span className="text-xs font-bold text-zinc-400 line-through">
                      ${parseFloat(prod.compare_at_price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Direct Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(prod)}
                  className="w-full h-11 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>🛒 {t("btn.addToCart")}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black text-xs border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
          >
            <span>Explore Entire Marketplace Catalog</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
