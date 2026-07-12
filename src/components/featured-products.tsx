"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { ProductCard } from "@/components/cards";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import DynamicLoading from "./dynamicLoading/DynamicLoading";

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
  tags: string; // Comma separated tags
  seller_shop: string; // Vendor name
  seller?: string; // Seller profile UUID
  rating?: number;
}

export default function FeaturedProducts() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

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
      // Run initial check
      checkScroll();

      const resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [categories]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get("/api/products/"),
          api.get("/api/categories/")
        ]);

        if (prodRes.data) {
          const parsed = prodRes.data.map((p: any) => ({
            ...p,
            rating: p.rating || parseFloat((4.2 + Math.random() * 0.7).toFixed(1))
          }));
          setProducts(parsed);
        } else {
          setProducts([]);
        }

        if (catRes.data) {
          setCategories([
            { id: "all", name: "All Products", slug: "all" },
            ...catRes.data
          ]);
        } else {
          setCategories([{ id: "all", name: "All Products", slug: "all" }]);
        }
      } catch (err) {
        console.error("Backend products fetch failed:", err);
        setProducts([]);
        setCategories([{ id: "all", name: "All Products", slug: "all" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

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
    
    if (product.id.startsWith("prod-")) {
      Swal.fire({
        title: "Demo Product",
        text: "This is a demo product shown because the marketplace is currently empty. Please add real products from the seller dashboard to test the cart functionality.",
        icon: "info",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      await addToCart(product.id, 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Added to cart!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    } catch (err) {
      console.error("Cart add failed:", err);
      Swal.fire({
        title: "Failed to Add",
        text: "Something went wrong adding product to cart.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  // Filter products based on active category
  const filteredProducts = products.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  // Map category ID to its name for display in the Card
  const getCategoryName = (catId: string) => {
    const match = categories.find((c) => c.id === catId);
    return match ? match.name : "Marketplace";
  };

  if(loading) return <DynamicLoading loadingText="Loading marketplace catalog..." />;

  return (
    <section className="relative py-24 bg-zinc-50 border-t border-zinc-200/80 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 select-none font-sans">
            🔥 Trending Now
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 font-sans">
            Featured & Trending Products <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              সেরা ও ট্রেন্ডিং প্রোডাক্টস
            </span>
          </h2>
        </div>

        {/* Categories Tab Swapper - Horizontal Scrollable Pill Bar */}
        <div className="relative w-full mb-12 select-none group/scroll">
          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll(-240)}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-lg flex items-center justify-center text-zinc-700 hover:text-indigo-600 hover:bg-zinc-50 transition-all z-20 cursor-pointer active:scale-95"
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
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-lg flex items-center justify-center text-zinc-700 hover:text-indigo-600 hover:bg-zinc-50 transition-all z-20 cursor-pointer active:scale-95"
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
            className="flex gap-2.5 overflow-x-auto pb-3 pt-1 px-12 justify-start items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                  activeCategory === cat.id
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 scale-[1.03]"
                    : "bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        { filteredProducts.length === 0 ? (
          <div className="py-24 text-center text-zinc-400 font-bold text-sm">
            No products found under this category.
          </div>
        ) : (
          /* Products Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              // Prepend host to relative image path
              const imageUrl = prod.image 
                ? prod.image.startsWith("http") 
                  ? prod.image 
                  : `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}${prod.image}`
                : undefined;

              return (
                <ProductCard
                  key={prod.id}
                  image={imageUrl}
                  category={getCategoryName(prod.category)}
                  title={prod.name}
                  price={parseFloat(prod.price)}
                  rating={prod.rating}
                  seller={prod.seller}
                  sellerShop={prod.seller_shop}
                  onAddToCart={() => handleAddToCart(prod)}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
