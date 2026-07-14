"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CartIcon, TrashIcon } from "@/components/icons";
import Swal from "sweetalert2";
import api from "@/lib/api";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    isLoading,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [manualCodes, setManualCodes] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<{
    applied_coupons: any[];
    invalid_coupons: any[];
    total_discount: string;
    final_subtotal: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const getClippedCodes = (): string[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("clipped_coupons") || "[]");
  };

  const validateAppliedCoupons = async (currentManualCodes = manualCodes) => {
    if (cartItems.length === 0) {
      setValidationResult(null);
      return;
    }

    const clipped = getClippedCodes();
    const allCodes = Array.from(new Set([...clipped, ...currentManualCodes]));

    if (allCodes.length === 0) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    setErrorMessage("");
    try {
      const response = await api.post("/api/coupons/validate/", {
        codes: allCodes,
        cart_items: cartItems.map((item) => ({
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
          seller_id: item.seller_id,
        })),
      });
      setValidationResult(response.data);
    } catch (error) {
      console.error("Failed to validate coupons:", error);
      setErrorMessage("Failed to calculate coupon discounts.");
    } finally {
      setIsValidating(false);
    }
  };

  // Re-validate coupons whenever cart changes, manual codes update, or drawer is opened
  useEffect(() => {
    if (isCartOpen) {
      validateAppliedCoupons();
    }
  }, [cartItems, isCartOpen, manualCodes]);

  // Listen for real-time coupon clipping changes on storefront product cards
  useEffect(() => {
    const handleClippedChange = () => {
      validateAppliedCoupons();
    };
    window.addEventListener("clipped_coupons_changed", handleClippedChange);
    return () => {
      window.removeEventListener("clipped_coupons_changed", handleClippedChange);
    };
  }, [cartItems, manualCodes]);

  const handleApplyManualCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (manualCodes.includes(cleanCode) || getClippedCodes().includes(cleanCode)) {
      setErrorMessage("This coupon is already applied.");
      return;
    }

    const nextManual = [...manualCodes, cleanCode];
    setIsValidating(true);
    setErrorMessage("");
    try {
      const response = await api.post("/api/coupons/validate/", {
        codes: Array.from(new Set([...getClippedCodes(), ...nextManual])),
        cart_items: cartItems.map((item) => ({
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
          seller_id: item.seller_id,
        })),
      });

      const wasApplied = response.data.applied_coupons.some(
        (c: any) => c.code === cleanCode
      );

      if (wasApplied) {
        setManualCodes(nextManual);
        setValidationResult(response.data);
        setCouponInput("");
        Swal.fire({
          title: "Applied!",
          text: `Coupon code ${cleanCode} has been applied.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const invalidInfo = response.data.invalid_coupons.find(
          (c: any) => c.code === cleanCode
        );
        setErrorMessage(invalidInfo?.reason || "Coupon code could not be applied.");
      }
    } catch (err) {
      setErrorMessage("Coupon validation failed.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = (code: string) => {
    if (manualCodes.includes(code)) {
      setManualCodes((prev) => prev.filter((c) => c !== code));
    }
    const clipped = getClippedCodes();
    if (clipped.includes(code)) {
      const nextClipped = clipped.filter((c: string) => c !== code);
      localStorage.setItem("clipped_coupons", JSON.stringify(nextClipped));
      window.dispatchEvent(new Event("clipped_coupons_changed"));
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300 ease-out">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <CartIcon className="w-5.5 h-5.5 text-indigo-600" />
              Your Shopping Cart
            </h2>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              {cartCount} {cartCount === 1 ? "item" : "items"} currently in bag
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100 min-h-0 relative">
          {/* Glassmorphic Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1.5px] flex items-center justify-center z-25 transition-all duration-200">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[11px] font-bold text-zinc-650 tracking-wide uppercase font-sans">Updating Cart...</span>
              </div>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <CartIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-zinc-800">Your cart is empty</h3>
              <p className="text-xs text-zinc-550 mt-1 max-w-60">
                Explore our marketplace and add some products to get started!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/products");
                }}
                disabled={isLoading}
                className="mt-5 h-9 px-6 rounded-full bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-40"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product_id} className="py-4.5 flex gap-4 first:pt-0 last:pb-0 group">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-xl bg-zinc-50 border border-zinc-150 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {item.image ? (
                    <Image
                      src={item?.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <CartIcon className="w-6 h-6 text-zinc-300" />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col min-w-0 justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-zinc-800 truncate group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-xs font-extrabold text-zinc-950 shrink-0">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wider text-left">
                      🛒 {item.seller_shop}
                    </p>
                  </div>

                  {/* Controls (Quantity + Remove) */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50/50 shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                        className="w-6.5 h-6.5 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 transition-colors font-bold text-xs cursor-pointer disabled:opacity-40"
                        disabled={item.quantity <= 1 || isLoading}
                      >
                        -
                      </button>
                      <span className="px-2 text-[11px] font-bold text-zinc-800 min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                        className="w-6.5 h-6.5 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 transition-colors font-bold text-xs cursor-pointer disabled:opacity-40"
                        disabled={isLoading}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      disabled={isLoading}
                      className="p-1 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-zinc-100 bg-zinc-50/50 space-y-4">
            
            {/* Coupon Input Form */}
            <form onSubmit={handleApplyManualCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 h-9 px-3 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-lg text-xs font-semibold outline-none bg-white uppercase text-zinc-800"
              />
              <button
                type="submit"
                disabled={isValidating || !couponInput.trim()}
                className="h-9 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-40"
              >
                Apply
              </button>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-[10px] text-red-500 font-semibold text-left">{errorMessage}</p>
            )}

            {/* Applied Coupons List */}
            {validationResult && validationResult.applied_coupons.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block text-left">
                  Applied Coupons
                </span>
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {validationResult.applied_coupons.map((coupon) => (
                    <span
                      key={coupon.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-800"
                    >
                      <span>🏷️ {coupon.code} (-${parseFloat(coupon.discount_amount).toFixed(2)})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoupon(coupon.code)}
                        className="hover:text-emerald-955 font-bold ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Invalid Coupons Warnings */}
            {validationResult && validationResult.invalid_coupons.length > 0 && (
              <div className="space-y-1 text-left">
                {validationResult.invalid_coupons.map((coupon) => (
                  <p
                    key={coupon.code}
                    className="text-[9px] text-amber-600 font-medium"
                  >
                    ⚠️ {coupon.code}: {coupon.reason}
                  </p>
                ))}
              </div>
            )}

            {/* Calculation Totals */}
            <div className="space-y-2 pt-2 border-t border-zinc-150">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
                <span>Subtotal</span>
                <span className="text-sm font-bold text-zinc-800">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {validationResult && parseFloat(validationResult.total_discount) > 0 && (
                <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
                  <span>Coupon Discount</span>
                  <span>
                    -${parseFloat(validationResult.total_discount).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-zinc-900 text-xs font-extrabold pt-1">
                <span>Total Amount</span>
                <span className="text-base font-black text-indigo-700">
                  ${validationResult ? parseFloat(validationResult.final_subtotal).toFixed(2) : subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 text-center font-medium leading-normal pt-1">
              Shipping and taxes are calculated at checkout.
            </p>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                disabled={isLoading}
                className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                disabled={isLoading}
                className="w-full h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-650 font-bold text-[10px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
