import React, { useState, useEffect } from "react";
import CouponCard from "@/components/coupons/CouponCard";
import api from "@/lib/api";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";

interface ProductCardProps {
  id?: string;
  image?: string | null;
  category?: string;
  title: string; // maps to product.name
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  stock?: number;
  description?: string;
  color?: string;
  sizes?: string;
  sellerShop?: string;
  seller?: string; // seller profile UUID
  tags?: string; // comma-separated tags (featured, popular, new_arrival)
  rating?: number;
  onAddToCart?: () => void;
  is_digital?: boolean;
  qr_code_url?: string;
  barcode_url?: string;
  name_bn?: string;
  description_bn?: string;
}

// Global cached promise to prevent redundant API queries across multiple product cards
let globalCouponsPromise: Promise<any> | null = null;
const fetchAllActiveCouponsCached = () => {
  if (!globalCouponsPromise) {
    globalCouponsPromise = api
      .get("/api/coupons/")
      .then((res) => res.data)
      .catch(() => []);
  }
  return globalCouponsPromise;
};

export function ProductCard({
  id,
  image,
  category,
  title,
  price,
  compareAtPrice,
  sku,
  stock = 1,
  description,
  color,
  sizes,
  sellerShop,
  seller,
  tags,
  rating,
  onAddToCart,
  is_digital = false,
  qr_code_url,
  barcode_url,
  name_bn,
  description_bn,
}: ProductCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [lang, setLang] = useState<"en" | "bn">("en");
  const { isLoading: isCartLoading } = useCart();

  // Fetch active coupons matching this product's seller or global/sitewide coupons
  // Filter out coupons whose minimum purchase requirement exceeds the product's price
  useEffect(() => {
    if (seller) {
      fetchAllActiveCouponsCached().then((allCoupons) => {
        const matched = allCoupons.filter(
          (c: any) =>
            c.is_active &&
            (c.seller === seller || !c.seller) &&
            parseFloat(c.min_purchase || "0") <= price
        );
        setAvailableCoupons(matched);
      });
    }
  }, [seller, price]);

  // Parse tags for floating badges
  const badgeList = tags
    ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];
  const hasFeatured = badgeList.includes("featured");
  const hasPopular = badgeList.includes("popular");
  const hasNewArrival = badgeList.includes("new_arrival");

  return (
    <>
      <div
        onClick={() => setShowDetailsModal(true)}
        className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-4 text-left flex flex-col justify-between hover-neon-glow group cursor-pointer"
      >
        <div className="space-y-4">
          {/* Image Container */}
          <div className="aspect-square w-full rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden group">
            {image ? (
              <Image
                src={image}
                alt={title}
                priority={false}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}

            {/* Floating Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {hasFeatured && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-650 text-[8px] font-extrabold text-white uppercase tracking-wider">
                  Featured
                </span>
              )}
              {hasPopular && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-[8px] font-extrabold text-white uppercase tracking-wider">
                  Popular
                </span>
              )}
              {hasNewArrival && (
                <span className="px-2 py-0.5 rounded-md bg-purple-600 text-[8px] font-extrabold text-white uppercase tracking-wider">
                  New Arrival
                </span>
              )}
            </div>

            {/* Shop Owner Tag */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-xs text-[8px] font-bold text-white uppercase tracking-wider z-10">
              🛒 {sellerShop || "Direct Store"}
            </div>
          </div>

          {/* Product Info Block */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wide">
              <span>SKU: {sku || "N/A"}</span>
              {category && <span className="text-indigo-650 dark:text-indigo-400 lowercase">{category}</span>}
            </div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
            <p className="text-[11px] text-zinc-450 dark:text-zinc-400 line-clamp-2 leading-relaxed h-8">
              {description || "No description provided."}
            </p>
          </div>

          {/* Colors and Sizes options */}
          {(color || sizes) && (
            <div className="space-y-1 pt-2 border-t border-zinc-100">
              {color && (
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase shrink-0">Colors:</span>
                  <span className="text-[10px] font-semibold text-zinc-600 truncate">{color}</span>
                </div>
              )}
              {sizes && (
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase shrink-0">Sizes:</span>
                  <span className="text-[10px] font-semibold text-zinc-650 truncate">{sizes}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing / CTA button */}
        <div className="space-y-3 pt-3 w-full">
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-indigo-700 dark:text-indigo-400">${price.toFixed(2)}</span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 line-through">
                    ${compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {/* Show Amazon-style green badge on the card if a coupon is available */}
              {availableCoupons.length > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[8px] font-extrabold uppercase border border-emerald-200 dark:border-emerald-900/30">
                    🏷️ Coupon Save {availableCoupons[0].discount_type === "percentage" ? `${parseFloat(availableCoupons[0].discount_value)}%` : `$${parseFloat(availableCoupons[0].discount_value).toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>
            <span className={`text-[10px] font-bold ${stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
            </span>
          </div>

          <button
            disabled={stock <= 0 || isAdding || isCartLoading}
            onClick={async (e) => {
              e.stopPropagation();
              if (onAddToCart) {
                setIsAdding(true);
                try {
                  await onAddToCart();
                } finally {
                  setIsAdding(false);
                }
              }
            }}
            className={`w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${stock > 0 && !isAdding && !isCartLoading
              ? "bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 active:scale-95"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-550 cursor-not-allowed"
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Product Details Modal Overlay */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetailsModal(false);
          }}
        >
          {/* Modal Container */}
          <div
            className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Box: Image & Shop */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="aspect-square w-full rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center relative overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    fill
                    priority={false}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                ) : (
                  <svg className="w-16 h-16 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {hasFeatured && (
                    <span className="px-2.5 py-1 rounded-md bg-indigo-650 text-[9px] font-extrabold text-white uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  {hasPopular && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-[9px] font-extrabold text-white uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  {hasNewArrival && (
                    <span className="px-2.5 py-1 rounded-md bg-purple-600 text-[9px] font-extrabold text-white uppercase tracking-wider">
                      New Arrival
                    </span>
                  )}
                </div>
              </div>

              {/* Shop info */}
              <div className="p-4 bg-zinc-50 border border-zinc-150/70 rounded-2xl flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Storeowner Merchant</span>
                  <h4 className="text-sm font-bold text-zinc-950 mt-0.5">🛒 {sellerShop || "Platform Direct Store"}</h4>
                </div>
              </div>
            </div>

            {/* Right Box: Spec details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between text-left space-y-4 pt-4 md:pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                    {category || "General"}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    {(name_bn || description_bn) && (
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50 p-0.5 text-[9px] font-extrabold">
                        <button
                          onClick={() => setLang("en")}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${lang === "en" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
                        >
                          EN
                        </button>
                        <button
                          onClick={() => setLang("bn")}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${lang === "bn" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
                        >
                          বাংলা
                        </button>
                      </div>
                    )}
                    <span className="text-xs font-bold font-mono text-zinc-400">SKU: {sku || "N/A"}</span>
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-zinc-955 leading-tight">
                  {lang === "en" ? title : (name_bn || title)}
                </h2>

                {/* Rating stars */}
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating || 4.5) ? "fill-current" : "stroke-current text-zinc-300"}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.772-.56-.372-1.81.587-1.81h4.907a1 1 0 00.95-.69l1.52-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-zinc-550">({rating || "4.5"} Rating Score)</span>
                </div>

                {/* Detailed Description */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Product Information</span>
                  <p className="text-xs md:text-sm text-zinc-500 font-semibold leading-relaxed max-h-[100px] overflow-y-auto pr-2">
                    {lang === "en" 
                      ? (description || "No description provided.") 
                      : (description_bn || description || "কোনো বিবরণ প্রদান করা হয়নি।")}
                  </p>
                </div>

                {/* Attributes (Colors / Sizes) */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Colors</span>
                    <span className="text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-150 px-3 py-1.5 rounded-lg inline-block">
                      {color || "Default / Multi"}
                    </span>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Sizes</span>
                    <span className="text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-150 px-3 py-1.5 rounded-lg inline-block">
                      {sizes || "Standard O/S"}
                    </span>
                  </div>
                </div>

                {/* QR and Barcode Indicators */}
                <div className="flex gap-4 pt-3 border-t border-zinc-100 items-center justify-between">
                  {qr_code_url && (
                    <div className="flex flex-col items-center gap-1 border border-zinc-150 p-2 rounded-2xl bg-zinc-50/50">
                      <span className="text-[8px] font-black text-zinc-450 uppercase font-sans tracking-wide">Scan Details</span>
                      <Image
                        src={qr_code_url}
                        alt="Product QR Code"
                        width={64}
                        height={64}
                        unoptimized
                        className="object-contain rounded-lg shadow-xs"
                      />
                    </div>
                  )}
                  {barcode_url && (
                    <div className="flex flex-col items-center gap-1 border border-zinc-150 p-2 rounded-2xl bg-zinc-50/50 flex-1">
                      <span className="text-[8px] font-black text-zinc-450 uppercase font-sans tracking-wide">Product Barcode</span>
                      <div className="relative h-10 w-full">
                        <Image
                          src={barcode_url}
                          alt="Product Barcode"
                          fill
                          unoptimized
                          className="object-contain rounded"
                        />
                      </div>
                      <span className="text-[8px] font-bold font-mono text-zinc-550 mt-0.5">{sku || id?.substring(0, 8)}</span>
                    </div>
                  )}
                </div>

                {/* Amazon Style Coupon Display inside the details modal */}
                {availableCoupons.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-zinc-100">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                      🏷️ Available Coupons
                    </span>
                    <div className="flex flex-col gap-2">
                      {availableCoupons.map((coupon) => (
                        <CouponCard
                          key={coupon.id}
                          code={coupon.code}
                          type={coupon.type || coupon.discount_type}
                          value={parseFloat(coupon.value || coupon.discount_value)}
                          minPurchase={parseFloat(coupon.minPurchase || coupon.min_purchase)}
                          sellerShop={coupon.sellerShop || coupon.seller_shop}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bottom */}
              <div className="pt-5 border-t border-zinc-100 flex items-center justify-between gap-4 mt-6">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Price tag</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-indigo-700">${price.toFixed(2)}</span>
                    {compareAtPrice && compareAtPrice > price && (
                      <span className="text-sm font-semibold text-zinc-400 line-through">
                        ${compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${stock > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-500 border border-red-200"}`}>
                    {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
                  </span>

                  <button
                    disabled={stock <= 0 || isAdding || isCartLoading}
                    onClick={async () => {
                      if (onAddToCart) {
                        setIsAdding(true);
                        try {
                          await onAddToCart();
                        } finally {
                          setIsAdding(false);
                        }
                      }
                    }}
                    className={`h-11 px-6 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${stock > 0 && !isAdding && !isCartLoading
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 active:scale-95"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface StatsCardProps {
  label: string;
  value: React.ReactNode;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export function StatsCard({
  label,
  value,
  change,
  isPositive = true,
  icon,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex items-center justify-between hover-neon-glow">
      <div className="space-y-1.5 text-left">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</span>
        <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{value}</h3>
        {change && (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }`}
            >
              {change}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">vs last month</span>
          </div>
        )}
      </div>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-150 dark:border-zinc-700/60 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
          {icon}
        </div>
      )}
    </div>
  );
}
