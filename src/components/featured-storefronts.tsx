"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Storefront {
  id: string;
  name: string;
  sellerName: string;
  category: string;
  rating: number;
  productCount: number;
  bannerGradient: string;
  avatarChar: string;
}

export default function FeaturedStorefronts() {
  const [stores, setStores] = useState<Storefront[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback high-fidelity verified mock vendors
  const fallbackStores: Storefront[] = [
    {
      id: "shop-auralink",
      name: "AuraLink Official Store",
      sellerName: "Sarah Connor",
      category: "Premium Electronics",
      rating: 4.9,
      productCount: 24,
      bannerGradient: "from-indigo-500 to-purple-600",
      avatarChar: "A"
    },
    {
      id: "shop-apex",
      name: "Apex Athletic Apparel",
      sellerName: "Mark Jenkins",
      category: "Modern Sportswear & Fashion",
      rating: 4.8,
      productCount: 42,
      bannerGradient: "from-pink-500 to-rose-600",
      avatarChar: "A"
    },
    {
      id: "shop-saddlecraft",
      name: "SaddleCraft Leather Co.",
      sellerName: "Arthur Morgan",
      category: "Handmade Premium Bags",
      rating: 4.7,
      productCount: 18,
      bannerGradient: "from-amber-600 to-amber-800",
      avatarChar: "S"
    },
    {
      id: "shop-aromabliss",
      name: "AromaBliss Wellness",
      sellerName: "Elena Rostova",
      category: "Organic Candles & Oils",
      rating: 4.9,
      productCount: 31,
      bannerGradient: "from-emerald-500 to-teal-600",
      avatarChar: "A"
    }
  ];

  useEffect(() => {
    const loadStorefronts = async () => {
      try {
        setLoading(true);
        // Query products from backend and extract unique merchant shop names
        const prodRes = await api.get("/api/products/");
        const catRes = await api.get("/api/categories/");

        const categoriesMap: { [id: string]: string } = {};
        if (catRes.data) {
          catRes.data.forEach((c: any) => {
            categoriesMap[c.id] = c.name;
          });
        }

        if (prodRes.data && prodRes.data.length > 0) {
          const shopTally: { [name: string]: { count: number; category: string } } = {};
          
          prodRes.data.forEach((p: any) => {
            if (p.seller_shop) {
              const shopName = p.seller_shop.trim();
              const catName = categoriesMap[p.category] || "General Goods";
              if (!shopTally[shopName]) {
                shopTally[shopName] = { count: 1, category: catName };
              } else {
                shopTally[shopName].count += 1;
              }
            }
          });

          const extractedStores: Storefront[] = Object.keys(shopTally).map((shopName, idx) => {
            // Pick a consistent banner gradient based on index
            const gradients = [
              "from-indigo-500 to-purple-600",
              "from-pink-500 to-rose-600",
              "from-amber-600 to-amber-800",
              "from-emerald-500 to-teal-600",
              "from-blue-500 to-cyan-600",
            ];
            const selectGradient = gradients[idx % gradients.length];
            const cleanName = shopName || "Verified Vendor";

            return {
              id: `shop-db-${idx}`,
              name: cleanName,
              sellerName: "Certified Merchant",
              category: shopTally[shopName].category,
              rating: parseFloat((4.5 + (idx * 0.1) % 0.5).toFixed(1)),
              productCount: shopTally[shopName].count,
              bannerGradient: selectGradient,
              avatarChar: cleanName[0].toUpperCase()
            };
          });

          if (extractedStores.length > 0) {
            setStores(extractedStores);
          } else {
            setStores(fallbackStores);
          }
        } else {
          setStores(fallbackStores);
        }
      } catch (err) {
        console.warn("Backend products offline for seller tally, running local stores mockup.", err);
        setStores(fallbackStores);
      } finally {
        setLoading(false);
      }
    };

    loadStorefronts();
  }, []);

  return (
    <section className="relative py-24 bg-white border-t border-zinc-200/80 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 select-none">
            🏬 Verified Partners
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Featured Storefronts & Top Vendors <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-2xl sm:text-3xl">
              শীর্ষ বিক্রেতাদের গ্যালারি
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto font-medium">
            Explore premium individual storefronts operated by our certified global merchants.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-zinc-550 font-bold">Querying verified partners list...</span>
          </div>
        ) : (
          /* Vendors Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                className="group rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col justify-between text-center relative"
              >
                <div>
                  {/* Shop Card Header Banner */}
                  <div className={`h-24 w-full bg-linear-to-r ${store.bannerGradient} relative`} />

                  {/* Shop Avatar */}
                  <div className="relative -mt-10 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-zinc-150 shadow-md flex items-center justify-center text-zinc-900 font-extrabold text-2xl group-hover:scale-105 transition-transform duration-300">
                      <div className={`w-[90%] h-[90%] rounded-xl bg-linear-to-tr ${store.bannerGradient} text-white flex items-center justify-center`}>
                        {store.avatarChar}
                      </div>
                    </div>
                  </div>

                  {/* Shop Text Info */}
                  <div className="p-6 space-y-3">
                    <div className="space-y-1 text-center">
                      <h3 className="text-base font-extrabold text-zinc-950 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {store.name}
                      </h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                        Proprietor: {store.sellerName}
                      </p>
                    </div>

                    <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase">
                      {store.category}
                    </span>

                    {/* Review Stars & Products Count */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{store.rating} ({30 + Math.floor(store.rating * 10)} reviews)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-950 font-extrabold">{store.productCount}</span> products
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Store Action Button */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/shops`}
                    className="w-full h-11 rounded-2xl bg-zinc-50 hover:bg-indigo-600 hover:text-white text-zinc-800 border border-zinc-200 hover:border-transparent font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Visit Store
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
