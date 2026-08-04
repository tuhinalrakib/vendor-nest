"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function TenantCategoriesCatalog() {
  const params = useParams();
  const domain = (params.domain as string) || "";

  const vendorName = domain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [categories, setCategories] = useState<CategoryShowcase[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryShowcase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setIsLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get("/api/categories/"),
          api.get("/api/products/")
        ]);

        const sellerProducts = (prodRes.data || []).filter(
          (p: any) =>
            p.seller_shop &&
            p.seller_shop.toLowerCase().replace(/\s+/g, "-") === domain.toLowerCase()
        );

        if (catRes.data && catRes.data.length > 0) {
          const extracted: CategoryShowcase[] = catRes.data.map((cat: any, idx: number) => {
            const count = sellerProducts.filter((p: any) => p.category === cat.id).length;
            
            const gradients = [
              "from-blue-500 to-indigo-650",
              "from-pink-500 to-rose-600",
              "from-emerald-500 to-teal-600",
              "from-amber-500 to-orange-600",
              "from-purple-500 to-violet-650",
            ];
            const selectGradient = gradients[idx % gradients.length];

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
              description: cat.description || `Explore quality collections under the ${cat.name} department in our store.`,
              icon: iconElement,
              image: cat.image || null,
            };
          });

          // Only display categories that actually contain products for this seller to keep storefront clean
          const activeCategories = extracted.filter(cat => cat.productCount > 0);
          
          setCategories(activeCategories.length > 0 ? activeCategories : extracted);
          setFilteredCategories(activeCategories.length > 0 ? activeCategories : extracted);
        } else {
          setCategories([]);
          setFilteredCategories([]);
        }
      } catch (err) {
        console.warn("Backend categories offline, running local mock catalog showcase.", err);
        setCategories([]);
        setFilteredCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (domain) {
      fetchCategoriesData();
    }
  }, [domain]);

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
      {/* Hero Banner Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-12 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Departments</span>
          <h1 className="text-3xl font-extrabold text-zinc-955 dark:text-zinc-50 tracking-tight mt-1">{vendorName} Categories</h1>
          <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-550 mt-1 max-w-xl">
            Browse our curated collections of items. Filter our store catalog by department to find exactly what you need.
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
              placeholder="Search store categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-650 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-200 rounded-2xl text-sm font-semibold outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center mt-6 shadow-xs max-w-md mx-auto space-y-3 text-zinc-900 dark:text-zinc-200">
            <svg className="w-12 h-12 text-zinc-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-base font-extrabold">No categories found</h3>
            <p className="text-xs text-zinc-400">
              No categories matched your search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative h-48 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
              >
                {/* Background decorative gradient */}
                <div className={`absolute inset-0 bg-linear-to-br ${cat.bannerGradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className={`absolute -right-10 -bottom-10 w-36 h-36 bg-linear-to-br ${cat.bannerGradient} opacity-10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300`} />

                {/* Card Header (Icon & Badge Count) */}
                <div className="flex justify-between items-start z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${cat.bannerGradient} text-white shadow-xs group-hover:scale-105 transition-transform duration-200 flex items-center justify-center relative overflow-hidden shrink-0`}>
                    {cat.image ? (
                      <img
                        src={getImageUrl(cat.image)!}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      cat.icon
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-900/50 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.productCount} {cat.productCount === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {/* Card Footer (Name & Arrow) */}
                <div className="space-y-1.5 z-10 text-left">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-550 font-medium leading-relaxed truncate">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
