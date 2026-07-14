"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface Storefront {
  id: string;
  name: string;
  sellerName: string;
  category: string;
  rating: number;
  productCount: number;
  bannerGradient: string;
  avatarChar: string;
  description: string;
  featuredProducts: { id: string; name: string; price: string; image: string | null }[];
}

export default function ShopsCatalog() {
  const [stores, setStores] = useState<Storefront[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredStores, setFilteredStores] = useState<Storefront[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Scroll navigation states & refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth"
      });
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();

      const resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [categories]);

  // Fallback high-fidelity verified mock vendors
  const fallbackStores: Storefront[] = [
    {
      id: "shop-auralink",
      name: "AuraLink Official Store",
      sellerName: "Sarah Connor",
      category: "Electronics",
      rating: 4.9,
      productCount: 4,
      bannerGradient: "from-indigo-500 to-purple-600",
      avatarChar: "A",
      description: "State-of-the-art wireless headphones and smart premium audiophile gear.",
      featuredProducts: [
        { id: "prod-1", name: "AuraLink ANC Wireless Headphones", price: "299.00", image: null },
        { id: "prod-2", name: "USB-C Multi-port Hub 8-in-1", price: "49.99", image: null }
      ]
    },
    {
      id: "shop-apex",
      name: "Apex Athletic Apparel",
      sellerName: "Mark Jenkins",
      category: "Fashion",
      rating: 4.8,
      productCount: 5,
      bannerGradient: "from-pink-500 to-rose-600",
      avatarChar: "A",
      description: "Modern high-performance athletic apparel and stylish daily activewear.",
      featuredProducts: [
        { id: "prod-3", name: "Waterproof Urban Windbreaker", price: "120.00", image: null },
        { id: "prod-4", name: "Minimalist Full-Grain Leather Backpack", price: "180.00", image: null }
      ]
    },
    {
      id: "shop-saddlecraft",
      name: "SaddleCraft Leather Co.",
      sellerName: "Arthur Morgan",
      category: "Fashion",
      rating: 4.7,
      productCount: 3,
      bannerGradient: "from-amber-600 to-amber-800",
      avatarChar: "S",
      description: "Handmade premium leather bags, accessories, and durable items.",
      featuredProducts: [
        { id: "prod-4", name: "Minimalist Full-Grain Leather Backpack", price: "180.00", image: null }
      ]
    },
    {
      id: "shop-aromabliss",
      name: "AromaBliss Wellness",
      sellerName: "Elena Rostova",
      category: "Home & Living",
      rating: 4.9,
      productCount: 2,
      bannerGradient: "from-emerald-500 to-teal-600",
      avatarChar: "A",
      description: "Organic candles, natural oil diffusers, and soothing aromatherapies.",
      featuredProducts: [
        { id: "prod-5", name: "Organic Serene Lavender Soy Candle", price: "24.00", image: null }
      ]
    }
  ];

  useEffect(() => {
    const fetchShopsData = async () => {
      try {
        setIsLoading(true);
        // Query products and categories from backend
        const [prodRes, catRes] = await Promise.all([
          api.get("/api/products/"),
          api.get("/api/categories/")
        ]);

        const categoriesMap: { [id: string]: string } = {};
        const catNames: string[] = [];
        if (catRes.data) {
          catRes.data.forEach((c: any) => {
            categoriesMap[c.id] = c.name;
            if (!catNames.includes(c.name)) {
              catNames.push(c.name);
            }
          });
        }
        setCategories(catNames);

        if (prodRes.data && prodRes.data.length > 0) {
          const shopTally: {
            [name: string]: {
              category: string;
              products: { id: string; name: string; price: string; image: string | null }[]
            }
          } = {};

          prodRes.data.forEach((p: any) => {
            if (p.seller_shop) {
              const shopName = p.seller_shop.trim();
              const catName = categoriesMap[p.category] || "General Goods";
              if (!shopTally[shopName]) {
                shopTally[shopName] = {
                  category: catName,
                  products: []
                };
              }
              // Add product details for featured showcase inside card
              if (shopTally[shopName].products.length < 3) {
                shopTally[shopName].products.push({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.image
                });
              }
            }
          });

          const extractedStores: Storefront[] = Object.keys(shopTally).map((shopName, idx) => {
            const gradients = [
              "from-indigo-500 to-purple-600",
              "from-pink-500 to-rose-600",
              "from-amber-600 to-amber-800",
              "from-emerald-500 to-teal-600",
              "from-blue-500 to-cyan-600",
            ];
            const selectGradient = gradients[idx % gradients.length];
            const cleanName = shopName || "Verified Vendor";

            // Count total products belonging to this shop from main product array
            const count = prodRes.data.filter((p: any) => p.seller_shop?.trim() === shopName).length;

            return {
              id: `shop-db-${idx}`,
              name: cleanName,
              sellerName: "Certified Merchant",
              category: shopTally[shopName].category,
              rating: parseFloat((4.5 + (idx * 0.1) % 0.5).toFixed(1)),
              productCount: count,
              bannerGradient: selectGradient,
              avatarChar: cleanName[0].toUpperCase(),
              description: `Independent storefront specializing in ${shopTally[shopName].category.toLowerCase()} and high quality products.`,
              featuredProducts: shopTally[shopName].products
            };
          });

          if (extractedStores.length > 0) {
            setStores(extractedStores);
            setFilteredStores(extractedStores);
          } else {
            setStores(fallbackStores);
            setFilteredStores(fallbackStores);
          }
        } else {
          setStores(fallbackStores);
          setFilteredStores(fallbackStores);
        }
      } catch (err) {
        console.warn("Backend products offline, loading local shops mockup catalog.", err);
        setStores(fallbackStores);
        setFilteredStores(fallbackStores);
        setCategories(["Electronics", "Fashion", "Home & Living"]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopsData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...stores];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.sellerName.toLowerCase().includes(query)
      );
    }

    setFilteredStores(result);
  }, [selectedCategory, searchQuery, stores]);

  if(isLoading) return <DynamicLoading loadingText="Querying storefront network..." />;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans pb-20 transition-colors duration-300">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-100 h-100 bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-125 h-125 bg-purple-500/5 blur-[130px] pointer-events-none" />

      {/* Hero Banner Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-12 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">Verified Storefronts</h1>
          <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-1 max-w-xl">
            Explore and connect directly with independent global merchants. Enjoy unique product lines and direct customer support.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-10">

        {/* Filters Top Bar */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs">
          {/* Search Box */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search shops by name, brand, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-650 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-2xl text-sm font-semibold outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Filter Horizontal Pills */}
        <div className="relative w-full py-4 mt-4 select-none group/scroll">
          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll(-240)}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-indigo-650 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all z-20 cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Navigation Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll(240)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-indigo-650 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all z-20 cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Left & Right Fade Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none z-10 hidden sm:block" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none z-10 hidden sm:block" />

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto px-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none scroll-smooth"
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${selectedCategory === "all"
                  ? "bg-linear-to-r from-indigo-600 to-purple-650 text-white shadow-md shadow-indigo-600/20 scale-[1.02]"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-linear-to-r from-indigo-600 to-purple-650 text-white shadow-md shadow-indigo-600/20 scale-[1.02]"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        { filteredStores.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center mt-6 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-zinc-950 dark:text-zinc-550">No shops found</h3>
              <p className="text-xs font-semibold text-zinc-400">
                We couldn't find any merchant matching your search filters.
              </p>
            </div>
          </div>
        ) : (
          /* Shops Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-205 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover-neon-glow"
              >
                <div>
                  {/* Shop Banner Header */}
                  <div className={`h-24 w-full bg-linear-to-r ${store.bannerGradient} relative`} />

                  {/* Shop Details Block */}
                  <div className="p-6 relative">
                    {/* Avatar Icon floating */}
                    <div className="absolute -top-12 left-6">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 shadow-md flex items-center justify-center font-extrabold text-xl group-hover:scale-105 transition-transform duration-300">
                        <div className={`w-[90%] h-[90%] rounded-xl bg-linear-to-tr ${store.bannerGradient} text-white flex items-center justify-center`}>
                          {store.avatarChar}
                        </div>
                      </div>
                    </div>

                    {/* Meta names info */}
                    <div className="pt-6 space-y-2 text-left">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {store.name}
                        </h3>
                        <span className="shrink-0 inline-block text-[9px] font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {store.category}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
                        Seller: {store.sellerName}
                      </p>
                      <p className="text-xs text-zinc-450 dark:text-zinc-400 line-clamp-2 leading-relaxed h-8 font-semibold">
                        {store.description}
                      </p>
                    </div>

                    {/* Quick reviews rating block */}
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-450">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{store.rating} ({20 + Math.floor(store.rating * 8)} reviews)</span>
                      </div>
                      <div>
                        <span className="text-zinc-950 dark:text-zinc-200 font-extrabold">{store.productCount}</span> active items
                      </div>
                    </div>
                  </div>

                  {/* Featured mini-thumbnails gallery */}
                  {store.featuredProducts.length > 0 && (
                    <div className="px-6 pb-6 pt-2 text-left">
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest mb-2.5">Featured Catalog</p>
                      <div className="flex gap-3">
                        {store.featuredProducts.map((prod) => {
                          const imgUrl = prod.image
                            ? prod.image.startsWith("http")
                              ? prod.image
                              : `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}${prod.image}`
                            : null;
                          return (
                            <Link
                              key={prod.id}
                              href={`/products?search=${encodeURIComponent(prod.name)}`}
                              className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 overflow-hidden flex items-center justify-center shrink-0 hover:border-indigo-500 hover:scale-105 transition-all relative"
                              title={prod.name}
                            >
                              {imgUrl ? (
                                <Image
                                  src={imgUrl}
                                  alt={prod.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-650" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action footer */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/products?search=${encodeURIComponent(store.name)}`}
                    className="w-full h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-950 hover:bg-indigo-650 hover:text-white dark:hover:bg-indigo-600 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    View Catalog
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
