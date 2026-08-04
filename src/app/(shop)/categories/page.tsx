"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface CategoryShowcase {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  bannerGradient: string;
  description: string;
  icon: React.ReactNode;
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

export default function CategoriesCatalog() {
  const [categories, setCategories] = useState<CategoryShowcase[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryShowcase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // High-fidelity fallback categories
  const fallbackCategories: CategoryShowcase[] = [
    {
      id: "electronics",
      name: "Electronics",
      slug: "electronics",
      productCount: 15,
      bannerGradient: "from-blue-500 to-indigo-650",
      description: "Laptops, high-performance headphones, charging adapters & tech tools.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "fashion",
      name: "Fashion",
      slug: "fashion",
      productCount: 28,
      bannerGradient: "from-pink-500 to-rose-600",
      description: "Apparel, waterproof urban jackets, footwear & designer accessories.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 2.5 3 6s-1.343 6-3 6m0-12c-1.657 0-3 2.5-3 6s1.343 6 3 6m-9-6h9" />
        </svg>
      )
    },
    {
      id: "home",
      name: "Home & Living",
      slug: "home",
      productCount: 12,
      bannerGradient: "from-emerald-500 to-teal-600",
      description: "Organic hand-poured candles, LED desk lamps & room aesthetics.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setIsLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get("/api/categories/"),
          api.get("/api/products/")
        ]);

        if (catRes.data && catRes.data.length > 0) {
          const productsList = prodRes.data || [];
          
          const extracted: CategoryShowcase[] = catRes.data.map((cat: any, idx: number) => {
            const count = cat.product_count ?? productsList.filter((p: any) => p.category === cat.id).length;
            
            // Assign gradient styles based on category slug/name
            const gradients = [
              "from-blue-500 to-indigo-650",
              "from-pink-500 to-rose-600",
              "from-emerald-500 to-teal-600",
              "from-amber-500 to-orange-600",
              "from-purple-500 to-violet-650",
            ];
            const selectGradient = gradients[idx % gradients.length];

            // Assign icons based on keyword
            const nameLower = cat.name.toLowerCase();
            let iconElement = (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            );

            if (nameLower.includes("elect") || nameLower.includes("phone") || nameLower.includes("comp")) {
              iconElement = (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              );
            } else if (nameLower.includes("fash") || nameLower.includes("cloth") || nameLower.includes("shoe") || nameLower.includes("jewel")) {
              iconElement = (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 2.5 3 6s-1.343 6-3 6m0-12c-1.657 0-3 2.5-3 6s1.343 6 3 6m-9-6h9" />
                </svg>
              );
            } else if (nameLower.includes("home") || nameLower.includes("kitc") || nameLower.includes("furn") || nameLower.includes("liv")) {
              iconElement = (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              );
            }

            return {
              id: cat.id,
              name: cat.name,
              slug: cat.slug || cat.id,
              productCount: count,
              bannerGradient: selectGradient,
              description: cat.description || `Explore quality collections under the ${cat.name} marketplace department directory.`,
              icon: iconElement,
              image: cat.image || null,
            };
          });

          setCategories(extracted);
          setFilteredCategories(extracted);
        } else {
          setCategories(fallbackCategories);
          setFilteredCategories(fallbackCategories);
        }
      } catch (err) {
        console.warn("Backend categories offline, running local mock catalog showcase.", err);
        setCategories(fallbackCategories);
        setFilteredCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  // Filter categories by search input
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query)
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans pb-20 transition-colors duration-300">
      {/* Background glowing decorations */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[130px] pointer-events-none" />

      {/* Hero Banner Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-12 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-zinc-955 dark:text-zinc-50 tracking-tight">Marketplace Departments</h1>
          <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-550 mt-1 max-w-xl">
            Browse our curated collections of items. Filter the marketplace by focus area to find exactly what you need.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-10">
        
        {/* Search Bar filter */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex items-center">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search category departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-650 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-2xl text-sm font-semibold outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-zinc-550 dark:text-zinc-400 font-bold">Querying catalog departments...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center mt-8 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-zinc-955 dark:text-zinc-50">No categories found</h3>
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                We couldn't find any category department matching your search keywords.
              </p>
            </div>
          </div>
        ) : (
          /* Categories Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-205 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-3xl p-6 text-left flex flex-col justify-between hover:shadow-xl transition-all duration-300 group relative overflow-hidden hover-neon-glow"
              >
                {/* Floating ambient glow corner */}
                <div className={`absolute -right-4 -top-4 w-20 h-20 bg-linear-to-tr ${cat.bannerGradient} opacity-5 group-hover:opacity-10 transition-opacity rounded-full blur-xl pointer-events-none`} />

                <div className="space-y-6">
                  {/* Category Header with Icon / Image */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-linear-to-tr ${cat.bannerGradient} text-white flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden shrink-0`}>
                      {cat.image ? (
                        <img
                          src={getImageUrl(cat.image)!}
                          alt={cat.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        cat.icon
                      )}
                    </div>
                    <div className="text-left space-y-0.5">
                      <h3 className="text-base font-extrabold text-zinc-955 dark:text-zinc-50 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest">
                        {cat.productCount} Active Items
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-zinc-450 dark:text-zinc-400 leading-relaxed font-semibold">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom CTA Browse Link */}
                <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="w-full h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-950 hover:bg-indigo-650 hover:text-white dark:hover:bg-indigo-600 text-zinc-800 dark:text-zinc-300 border border-zinc-205 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    <span>Browse Collection</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
