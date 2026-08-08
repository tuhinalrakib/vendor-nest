"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/cards";
import { useLanguage } from "@/lib/LanguageContext";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  compare_at_price: string | null;
  stock: number;
  description: string;
  image: string | null;
  category: string; // Category ID
  tags: string; // Comma separated tags (badges like featured, popular)
  color: string;
  sizes: string;
  seller_shop: string; // Vendor name
  seller?: string; // Seller profile UUID
}

export default function ProductsCatalog() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { lang, tp, t } = useLanguage();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch both products and categories in parallel
      const [prodRes, catRes] = await Promise.all([
        api.get("/api/products/"),
        api.get("/api/categories/"),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setFilteredProducts(prodRes.data);
    } catch (err: any) {
      console.error("Failed to load catalog data:", err);
      Swal.fire({
        title: lang === "bn" ? "লোড ব্যর্থ হয়েছে" : "Load Failed",
        text: lang === "bn" ? "সার্ভার থেকে প্রোডাক্ট ক্যাটালগ লোড করা যায়নি।" : "Could not load marketplace catalog from server.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchVal = params.get("search");
      const catVal = params.get("category");
      if (searchVal) setSearchQuery(searchVal);
      if (catVal) setSelectedCategory(catVal);
    }
  }, []);

  // Filter and Sort Logic
  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.seller_shop && p.seller_shop.toLowerCase().includes(query))
      );
    }

    // Apply Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, sortBy, products]);

  // Helper to parse badges/tags
  const getBadges = (tagsStr: string) => {
    if (!tagsStr) return [];
    return tagsStr.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please sign in to add items to your shopping cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#d33",
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
      await addToCart(product.id, 1);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: lang === "bn" ? `"${tp(product, "name")}" কার্টে যুক্ত হয়েছে` : `"${product.name}" added to cart`
      });
    } catch (err) {
      Swal.fire({
        title: lang === "bn" ? "ত্রুটি" : "Error",
        text: lang === "bn" ? "কার্টে পণ্য যুক্ত করতে সমস্যা হয়েছে।" : "Failed to add product to cart. Please try again.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const translateCategory = (catName: string) => {
    if (lang !== "bn") return catName;
    const lower = catName.toLowerCase();
    if (lower === "electronics") return "ইলেকট্রনিক্স";
    if (lower === "fashion" || lower === "clothing") return "ফ্যাশন";
    if (lower === "home & living" || lower === "home") return "হোম ও লিভিং";
    if (lower === "smart tech" || lower === "gadgets") return "স্মার্ট টেকনোলজি";
    return catName;
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans pb-20 transition-colors duration-300 relative overflow-x-clip">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      {/* Hero Banner Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-12 text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
            {lang === "bn" ? "মার্কেটপ্লেস ক্যাটালগ" : "Marketplace Catalog"}
          </h1>
          <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-1 max-w-xl">
            {lang === "bn"
              ? "ভেরিফায়েড মার্চেন্টদের মানসম্মত পণ্যসামগ্রী ব্রাউজ করুন। ইউনিক পণ্য খুঁজুন এবং স্বাধীন বিক্রেতাদের পাশে থাকুন।"
              : "Browse high-quality products listed by verified independent vendors. Find unique items and support direct creators."}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-10">
        
        {/* Filters Top bar */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={lang === "bn" ? "পণ্য, এসকেইউ, ট্যাগ বা দোকান দিয়ে খুঁজুন..." : "Search products, SKUs, tags or shops..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-650 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-550 rounded-2xl text-sm font-semibold outline-none transition-all"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-zinc-550 dark:text-zinc-400 whitespace-nowrap">
              {lang === "bn" ? "সর্ট করুন" : "Sort By"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-650 text-zinc-900 dark:text-zinc-350 rounded-2xl text-xs font-bold outline-none cursor-pointer"
            >
              <option value="default">{lang === "bn" ? "নতুন প্রোডাক্টসমূহ" : "Newest Additions"}</option>
              <option value="price-low">{lang === "bn" ? "দাম: কম থেকে বেশি" : "Price: Low to High"}</option>
              <option value="price-high">{lang === "bn" ? "দাম: বেশি থেকে কম" : "Price: High to Low"}</option>
              <option value="name">{lang === "bn" ? "বর্ণানুক্রমিক (A-Z)" : "Alphabetical (A-Z)"}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Horizontal Pills */}
        <div className="relative w-full py-4 select-none group/scroll">
          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll(-240)}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all z-20 cursor-pointer active:scale-95"
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
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all z-20 cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Left & Right Fade Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-zinc-50 to-transparent pointer-events-none z-10 hidden sm:block" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-zinc-50 to-transparent pointer-events-none z-10 hidden sm:block" />

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto px-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                selectedCategory === "all"
                  ? "bg-linear-to-r from-indigo-600 to-purple-650 text-white shadow-md shadow-indigo-600/20 scale-[1.03]"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {lang === "bn" ? "সকল ক্যাটাগরি" : "All Categories"}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                  selectedCategory === cat.id
                    ? "bg-linear-to-r from-indigo-600 to-purple-650 text-white shadow-md shadow-indigo-600/20 scale-[1.03]"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {translateCategory(cat.name)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Layout Grid */}
        {isLoading ? (
          /* Skeleton Loader cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <div key={s} className="bg-white border border-zinc-200 rounded-3xl p-4 space-y-4 animate-pulse">
                <div className="aspect-square w-full rounded-2xl bg-zinc-100" />
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-100 rounded-lg w-2/3" />
                  <div className="h-3 bg-zinc-100 rounded-lg w-1/3" />
                  <div className="h-4 bg-zinc-100 rounded-lg w-1/2 pt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search/Filter State */
          <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center mt-6 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-zinc-950">
                {lang === "bn" ? "কোনো পণ্য পাওয়া যায়নি" : "No products found"}
              </h3>
              <p className="text-xs font-semibold text-zinc-400">
                {lang === "bn"
                  ? "আপনার ক্যাটাগরি বা অনুসন্ধানের সাথে মেলে এমন কোনো প্রোডাক্ট পাওয়া যায়নি।"
                  : "We couldn't find any products matching your current category selection or search keywords."}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {lang === "bn" ? "ফিল্টার ক্লিয়ার করুন" : "Clear Filters"}
            </button>
          </div>
        ) : (
          /* Products Grid view */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filteredProducts.map((p) => {
              const catName = categories.find((c) => c.id === p.category)?.name || "Marketplace";
              return (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  image={p.image}
                  category={catName}
                  title={p.name}
                  price={parseFloat(p.price)}
                  compareAtPrice={p.compare_at_price ? parseFloat(p.compare_at_price) : null}
                  sku={p.sku}
                  stock={p.stock}
                  description={p.description}
                  color={p.color}
                  sizes={p.sizes}
                  sellerShop={p.seller_shop}
                  seller={p.seller}
                  tags={p.tags}
                  onAddToCart={() => handleAddToCart(p)}
                  is_digital={(p as any).is_digital}
                  qr_code_url={(p as any).qr_code_url}
                  barcode_url={(p as any).barcode_url}
                  name_bn={(p as any).name_bn}
                  description_bn={(p as any).description_bn}
                />
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
