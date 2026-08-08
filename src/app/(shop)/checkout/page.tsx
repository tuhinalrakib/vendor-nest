"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import Swal from "sweetalert2";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";

/* ─── SVG Icon Components ─── */
const LockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const TruckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const CreditCardIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PhoneIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const HashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PackageIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const WalletIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BanknotesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

const CartBagIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const SpinnerIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { lang, t, tp } = useLanguage();
  const { cartItems, fetchCart, clearCart } = useCart();
  const { maintenanceMode } = useAuth();

  /* ─── Checkout Stepper ─── */
  const steps = [
    { label: lang === "bn" ? "কার্ট" : "Cart", icon: CartBagIcon },
    { label: lang === "bn" ? "শিপিং ও পেমেন্ট" : "Shipping & Payment", icon: TruckIcon },
    { label: lang === "bn" ? "কনফার্মেশন" : "Confirmation", icon: CheckCircleIcon },
  ];

  const translateProductName = (item: any) => {
    if (lang !== "bn") return item.name;
    if (item.name_bn) return item.name_bn;

    const nameMap: Record<string, string> = {
      "20W USB-C Fast Charger": "২০W ইউএসবি-সি ফাস্ট চার্জার",
      "Amazon Echo Dot (5th Gen) Smart Speaker": "অ্যামাজন ইকো ডট (৫ম জেন) স্মার্ট স্পিকার",
      "Wireless Noise-Canceling Headphones": "ওয়্যারলেস নয়েজ-ক্যানসেলিং হেডফোন",
      "Smart Fitness Watch Series 7": "স্মার্ট ফিটনেস ওয়াচ সিরিজ ৭",
      "Ergonomic Leather Gaming Chair": "অ্যারগোনমিক লেদার গেমিং চেয়ার",
      "Ultra-Thin Mechanical Keyboard": "আল্ট্রা-থিন মেকানিক্যাল কীবোর্ড",
      "4K Ultra HD Smart LED TV 55\"": "৪কে আল্ট্রা এইচডি স্মার্ট এলইডি টিভি ৫৫\"",
      "Stainless Steel Water Bottle": "স্টেইনলেস স্টিল ওয়াটার বোতল"
    };

    return nameMap[item.name] || tp(item, "name") || item.name;
  };

  // Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "sslcommerz" | "cod">("stripe");

  // Stripe Card Inputs (Simulation)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Totals calculations
  const [validationResult, setValidationResult] = useState<{
    applied_coupons: any[];
    total_discount: string;
    final_subtotal: string;
  } | null>(null);
  const [isLoadingTotals, setIsLoadingTotals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicableCoupons, setApplicableCoupons] = useState<any[]>([]);
  const [appliedCodes, setAppliedCodes] = useState<string[]>([]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const finalAmount = validationResult ? parseFloat(validationResult.final_subtotal) : subtotal;

  const getClippedCodes = (): string[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("clipped_coupons") || "[]");
  };

  useEffect(() => {
    const clipped = getClippedCodes();
    setAppliedCodes(clipped);
  }, []);

  useEffect(() => {
    // If cart is empty, redirect back to products catalog
    if (cartItems.length === 0) {
      router.push("/products");
    }
  }, [cartItems]);

  useEffect(() => {
    const fetchApplicableCoupons = async () => {
      if (cartItems.length === 0) return;
      try {
        const res = await api.post("/api/coupons/applicable/", {
          cart_items: cartItems.map((item) => ({
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
            seller_id: item.seller_id,
          })),
        });
        setApplicableCoupons(res.data);
      } catch (err) {
        console.error("Failed to load applicable coupons:", err);
      }
    };
    fetchApplicableCoupons();
  }, [cartItems]);

  useEffect(() => {
    validateCoupons(appliedCodes);
  }, [appliedCodes, cartItems]);

  const validateCoupons = async (codesToValidate: string[]) => {
    if (codesToValidate.length === 0) {
      setValidationResult(null);
      return;
    }

    setIsLoadingTotals(true);
    try {
      const res = await api.post("/api/coupons/validate/", {
        codes: codesToValidate,
        cart_items: cartItems.map((item) => ({
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
          seller_id: item.seller_id,
        })),
      });
      setValidationResult(res.data);
    } catch (err) {
      console.error("Failed to validate coupons at checkout:", err);
    } finally {
      setIsLoadingTotals(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const checkoutSuccess = params.get("checkout_success");
      const paymentStatus = params.get("payment_status");
      
      if (checkoutSuccess === "false") {
        if (paymentStatus === "cancel") {
          Swal.fire({
            title: lang === "bn" ? "পেমেন্ট বাতিল হয়েছে" : "Payment Cancelled",
            text: lang === "bn" ? "আপনার লেনদেন বাতিল করা হয়েছে।" : "Your SSLCommerz transaction was cancelled. You can try checkout again.",
            icon: "info",
            confirmButtonColor: "#4f46e5"
          });
        } else {
          Swal.fire({
            title: lang === "bn" ? "পেমেন্ট ব্যর্থ হয়েছে" : "Payment Failed",
            text: lang === "bn" ? "আপনার পেমেন্ট সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।" : "Your payment transaction could not be processed. Please try again.",
            icon: "error",
            confirmButtonColor: "#ef4444"
          });
        }
        
        // Clean the URL query params so the alert doesn't show again on reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [lang]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !address || !city || !zipCode) {
      Swal.fire(
        lang === "bn" ? "তথ্য অসম্পূর্ণ" : "Missing Fields",
        lang === "bn" ? "অনুগ্রহ করে আপনার ডেলিভারি ঠিকানার তথ্যগুলো পূরণ করুন।" : "Please complete your delivery address details.",
        "warning"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create order on the backend
      const orderRes = await api.post("/api/orders/", {
        total_amount: finalAmount.toFixed(2),
        coupon_codes: appliedCodes,
        items: cartItems.map((item) => ({
          product: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_name: fullName,
        shipping_phone: phoneNumber,
        shipping_address: address,
        shipping_city: city,
        shipping_zip: zipCode,
      });

      const orderId = orderRes.data.id;

      // 2. Process payments depending on selected gateway
      if (paymentMethod === "stripe") {
        // Stripe Checkout Session Creation
        const sessionRes = await api.post("/api/payments/stripe/create-checkout-session/", {
          order_id: orderId,
        });

        // Redirect user to Stripe Checkout page (hosted by Stripe or sandbox callback)
        window.location.href = sessionRes.data.checkout_url;

      } else if (paymentMethod === "sslcommerz") {
        // Initiate SSLCommerz redirection
        const sslRes = await api.post("/api/payments/sslcommerz/initiate/", {
          order_id: orderId,
        });
        
        // Redirect user to the SSLCommerz gateway URL
        window.location.href = sslRes.data.checkout_url;

      } else {
        // Cash on Delivery
        await api.post("/api/payments/cod/", {
          order_id: orderId,
        });

        // Clean cart state
        await clearCart();
        localStorage.removeItem("clipped_coupons");
        window.dispatchEvent(new Event("clipped_coupons_changed"));

        // Show confirmation popup before redirect
        Swal.fire({
          title: lang === "bn" ? "অর্ডার কনফার্ম হয়েছে!" : "Order Confirmed!",
          text: lang === "bn" ? "আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে।" : "Your order has been placed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // Redirect to success page
          router.push(`/order-success?type=cod&order_id=${orderId}`);
        });
      }

    } catch (err: any) {
      console.error("Checkout execution error:", err);
      Swal.fire(
        lang === "bn" ? "চেকআউট ব্যর্থ হয়েছে" : "Checkout Failed",
        lang === "bn" ? "আপনার অর্ডার প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Failed to process your checkout order. Please try again.",
        "error"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30 font-sans text-left">

      {/* ─── Premium Secure Checkout Header ─── */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Top row: branding + security */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <LockIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {lang === "bn" ? "সুরক্ষিত চেকআউট" : "Secure Checkout"}
                </h1>
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                  {lang === "bn" ? "২৫৬-বিট এসএসএল এনক্রিপ্টেড" : "256-bit SSL Encrypted"}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/40">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "ভেরিফায়েড ও সিকিউর" : "Verified & Secure"}</span>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = i === 1;
              const isCompleted = i === 0;

              return (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 shadow-md shadow-emerald-500/25"
                          : isActive
                          ? "bg-linear-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-100 dark:ring-indigo-950"
                          : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <StepIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold whitespace-nowrap ${
                        isCompleted ? "text-emerald-600 dark:text-emerald-400" : isActive ? "text-indigo-700 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-3 h-0.5 rounded-full relative -mt-5 overflow-hidden">
                      <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                          isCompleted ? "w-full bg-emerald-500" : isActive ? "w-1/2 bg-linear-to-r from-indigo-500 to-violet-500" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Main Checkout Content ─── */}
      <div className="max-w-5xl mx-auto px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ─── Left Column: Forms ─── */}
          <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">

            {/* ── Section: Shipping & Delivery ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm shadow-zinc-200/50 dark:shadow-none overflow-hidden transition-shadow hover:shadow-md">
              {/* Section header with accent stripe */}
              <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                  <TruckIcon className="w-[18px] h-[18px] text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-[13px] font-extrabold text-zinc-900 dark:text-zinc-50">
                    {lang === "bn" ? "শিপিং ও ডেলিভারি" : "Shipping & Delivery"}
                  </h2>
                  <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {lang === "bn" ? "আপনার অর্ডার কোথায় পৌঁছে দেব?" : "Where should we deliver your order?"}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserIcon className="w-3 h-3 text-zinc-400" />
                    {lang === "bn" ? "সম্পূর্ণ নাম" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === "bn" ? "যেমন: জন ডো" : "e.g. John Doe"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 px-4 bg-zinc-50/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-sm"
                    required
                  />
                </div>

                {/* Phone + Zip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <PhoneIcon className="w-3 h-3 text-zinc-400" />
                      {lang === "bn" ? "ফোন নম্বর" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      placeholder={lang === "bn" ? "যেমন: +৮৮০১৭০০০০০০০০" : "e.g. +8801700000000"}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-50/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HashIcon className="w-3 h-3 text-zinc-400" />
                      {lang === "bn" ? "পোস্টাল কোড" : "Zip Code"}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === "bn" ? "যেমন: ১২০৭" : "e.g. 1207"}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-50/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Address + City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPinIcon className="w-3 h-3 text-zinc-400" />
                      {lang === "bn" ? "ডেলিভারি ঠিকানা" : "Delivery Address"}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === "bn" ? "বাসা, রোড, এলাকা..." : "House, Street, Area..."}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-50/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BuildingIcon className="w-3 h-3 text-zinc-400" />
                      {lang === "bn" ? "শহর / জেলা" : "City"}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === "bn" ? "যেমন: ঢাকা" : "e.g. Dhaka"}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-50/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section: Payment Method ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm shadow-zinc-200/50 dark:shadow-none overflow-hidden transition-shadow hover:shadow-md">
              {/* Section header */}
              <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center shrink-0">
                  <CreditCardIcon className="w-[18px] h-[18px] text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 className="text-[13px] font-extrabold text-zinc-900 dark:text-zinc-50">
                    {lang === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
                  </h2>
                  <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {lang === "bn" ? "আপনার পছন্দের পেমেন্ট মাধ্যম বেছে নিন" : "Choose how you'd like to pay"}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Payment method cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Stripe Card */}
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer flex flex-col justify-between h-[100px] transition-all duration-200 group ${
                      paymentMethod === "stripe"
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-md shadow-indigo-500/10"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/50 hover:shadow-sm hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Selection checkmark badge */}
                    {paymentMethod === "stripe" && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        paymentMethod === "stripe" ? "bg-indigo-100 dark:bg-indigo-900/60" : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-150"
                      }`}>
                        <CreditCardIcon className={`w-4 h-4 ${paymentMethod === "stripe" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"}`} />
                      </div>
                      <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">Stripe</span>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                      {lang === "bn" ? "ভিসা, মাস্টারকার্ড, আমেক্স" : "Visa, MasterCard, Amex"}
                    </span>
                  </div>

                  {/* SSLCommerz Card */}
                  <div
                    onClick={() => setPaymentMethod("sslcommerz")}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer flex flex-col justify-between h-[100px] transition-all duration-200 group ${
                      paymentMethod === "sslcommerz"
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-md shadow-indigo-500/10"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/50 hover:shadow-sm hover:-translate-y-0.5"
                    }`}
                  >
                    {paymentMethod === "sslcommerz" && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        paymentMethod === "sslcommerz" ? "bg-indigo-100 dark:bg-indigo-900/60" : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-150"
                      }`}>
                        <WalletIcon className={`w-4 h-4 ${paymentMethod === "sslcommerz" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"}`} />
                      </div>
                      <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">SSLCommerz</span>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                      {lang === "bn" ? "বিকাশ, নগদ, কার্ড, নেট ব্যাংকিং" : "bKash, Nagad, Cards, Net Banking"}
                    </span>
                  </div>

                  {/* Cash on Delivery Card */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer flex flex-col justify-between h-[100px] transition-all duration-200 group ${
                      paymentMethod === "cod"
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-md shadow-indigo-500/10"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/50 hover:shadow-sm hover:-translate-y-0.5"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        paymentMethod === "cod" ? "bg-indigo-100 dark:bg-indigo-900/60" : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-150"
                      }`}>
                        <BanknotesIcon className={`w-4 h-4 ${paymentMethod === "cod" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"}`} />
                      </div>
                      <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                        {lang === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                      {lang === "bn" ? "হাতে পেয়ে মূল্য পরিশোধ" : "Pay on Hand Delivery"}
                    </span>
                  </div>
                </div>

                {/* Dynamic Payment Info Panel */}
                {paymentMethod === "stripe" && (
                  <div className="bg-linear-to-r from-indigo-50/60 to-violet-50/40 dark:from-indigo-950/40 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/40 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-xs font-semibold text-indigo-800/80 dark:text-indigo-300 leading-relaxed">
                      {lang === "bn"
                        ? "নিরাপদে কার্ডের তথ্য ইনপুট দিতে আপনাকে স্ট্রাইপ সিকিউর চেকআউটে নিয়ে যাওয়া হবে।"
                        : "You will be redirected to Stripe's secure hosted checkout to safely enter your card credentials. Your card details never touch our servers."}
                    </p>
                  </div>
                )}

                {paymentMethod === "sslcommerz" && (
                  <div className="bg-linear-to-r from-violet-50/50 to-pink-50/30 dark:from-violet-950/40 dark:to-pink-950/30 border border-violet-100 dark:border-violet-900/40 p-5 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">
                      {lang === "bn" ? "এসএসএলকমার্স গেটওয়ের মাধ্যমে নিরাপদে পেমেন্ট করুন" : "Pay securely with SSLCOMMERZ gateway"}
                    </span>
                    <p className="text-xs font-semibold text-zinc-650 dark:text-zinc-300 leading-relaxed">
                      {lang === "bn"
                        ? "এসএসএলকমার্স গেটওয়ের মাধ্যমে বিকাশ, নগদ, রকেট বা কার্ডে নিরাপদে পেমেন্ট সম্পন্ন করুন।"
                        : "You will be redirected to the SSLCOMMERZ Sandbox Gateway where you can complete your payment using bKash, Nagad, Rocket, Visa, Mastercard, or Net Banking."}
                    </p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="bg-linear-to-r from-amber-50/60 to-orange-50/30 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/40 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 mt-0.5">
                      <BanknotesIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-xs font-semibold text-amber-800/80 dark:text-amber-300 leading-relaxed">
                      {lang === "bn"
                        ? "অর্ডার হাতে পাওয়ার পর ডেলিভারিম্যানকে নগদ অর্থ পরিশোধ করুন। অর্ডার কনফার্ম হওয়ামাত্র প্রসেস করা হবে।"
                        : "Pay the delivery agent in cash upon delivery. Your order will be processed immediately after placement."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* ─── Right Column: Order Summary ─── */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm shadow-zinc-200/50 dark:shadow-none overflow-hidden lg:sticky lg:top-36">

              {/* Summary header */}
              <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                  <CartBagIcon className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-[13px] font-extrabold text-zinc-900 dark:text-zinc-50">
                    {lang === "bn" ? "অর্ডার সামারি" : "Order Summary"}
                  </h2>
                  <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {cartItems.length} {lang === "bn" ? "টি আইটেম অর্ডারে আছে" : cartItems.length === 1 ? "item in your order" : "items in your order"}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Cart Items List with thumbnails */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-60 overflow-y-auto pr-1 space-y-0">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 text-xs group">
                      <div className="w-12 h-12 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                        {(item as any).image ? (
                          <Image
                            src={(item as any).image}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <PackageIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200 truncate text-[11px]">
                          {translateProductName(item)}
                        </h4>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                          {lang === "bn" ? "পরিমাণ:" : "Qty:"} {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-extrabold text-zinc-900 dark:text-zinc-100 shrink-0 text-xs">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Available Coupons for Checkout */}
                {applicableCoupons.length > 0 && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      {lang === "bn" ? "আপনার পণ্যের জন্য সচল কুপনসমূহ" : "Available Coupons for your items"}
                    </span>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                      {applicableCoupons.map((coupon) => {
                        const isApplied = appliedCodes.includes(coupon.code);
                        const isPercent = coupon.discount_type === "percentage";
                        return (
                          <button
                            key={coupon.id}
                            type="button"
                            onClick={() => {
                              if (isApplied) {
                                setAppliedCodes((prev) => prev.filter((c) => c !== coupon.code));
                              } else {
                                setAppliedCodes((prev) => [...prev, coupon.code]);
                              }
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isApplied
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                                : "bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-bold uppercase truncate">
                                  {coupon.code}
                                </span>
                                <span className="text-[8px] font-extrabold px-1 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase truncate">
                                  {coupon.seller_shop}
                                </span>
                              </div>
                              <p className="text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                                {lang === "bn" ? "ছাড় " : "Save "}
                                {isPercent ? `${parseFloat(coupon.discount_value).toFixed(0)}%` : `$${parseFloat(coupon.discount_value).toFixed(2)}`}
                                {parseFloat(coupon.min_purchase) > 0 && (lang === "bn" ? ` সর্বনিম্ন $${parseFloat(coupon.min_purchase).toFixed(2)} কেনাকাটায়` : ` on min. buy $${parseFloat(coupon.min_purchase).toFixed(2)}`)}
                              </p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                              isApplied
                                ? "bg-emerald-600 text-white"
                                : "bg-white dark:bg-zinc-900 border border-zinc-350 dark:border-zinc-700 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50"
                            }`}>
                              {isApplied ? (lang === "bn" ? "✓ এপ্লাই করা হয়েছে" : "✓ Applied") : (lang === "bn" ? "এপ্লাই করুন" : "Apply")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Calculations Breakdown */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                    <span>{lang === "bn" ? "সাবটোটাল" : "Subtotal"}</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                    <span>{lang === "bn" ? "শিপিং" : "Shipping"}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{lang === "bn" ? "ফ্রি" : "Free"}</span>
                  </div>

                  {isLoadingTotals ? (
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                  ) : (
                    validationResult && parseFloat(validationResult.total_discount) > 0 && (
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {lang === "bn" ? "কুপন ডিসকাউন্ট" : "Coupon Discount"}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">-${parseFloat(validationResult.total_discount).toFixed(2)}</span>
                      </div>
                    )
                  )}

                  {/* Final Total */}
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">{lang === "bn" ? "সর্বমোট টাকা" : "Total"}</span>
                    <span className="text-xl font-black bg-linear-to-r from-indigo-700 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                      ${finalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Maintenance Mode Alert */}
                {maintenanceMode && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl text-left flex items-start gap-2.5 animate-in fade-in slide-in-from-top-3 duration-250 mb-4">
                    <span className="text-sm shrink-0">⚠️</span>
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      <div className="font-extrabold text-amber-900 dark:text-amber-200 mb-0.5">
                        {lang === "bn" ? "সাময়িকভাবে কেনাকাটা স্থগিত আছে" : "Purchases Temporarily Paused"}
                      </div>
                      {lang === "bn"
                        ? "প্ল্যাটফর্মে রক্ষণাবেক্ষণের কাজ চলছে। সাময়িকভাবে পেমেন্ট সার্ভিস স্থগিত আছে।"
                        : "The platform is currently undergoing scheduled maintenance. Checkout and payments are temporarily disabled. Please try again later."}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0 || maintenanceMode}
                  onClick={handleCheckoutSubmit}
                  className="w-full h-12 bg-linear-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:via-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent" />

                  {isSubmitting ? (
                    <span className="flex items-center gap-2 relative z-10">
                      <SpinnerIcon className="w-4 h-4 text-white" />
                      {lang === "bn" ? "অর্ডার প্রসেস হচ্ছে..." : "Processing Order..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 relative z-10">
                      <LockIcon className="w-3.5 h-3.5" />
                      <span>
                        {paymentMethod === "cod" 
                          ? (lang === "bn" ? "অর্ডার কনফার্ম করুন" : "Place your order")
                          : (lang === "bn" ? `পেমেন্ট করুন $${finalAmount.toFixed(2)}` : `Pay $${finalAmount.toFixed(2)}`)}
                      </span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="flex flex-col items-center gap-1.5 py-2.5 px-2 bg-zinc-50/80 dark:bg-zinc-950/80 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                    <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-400 text-center leading-tight">
                      {lang === "bn" ? "এসএসএল সিকিউর" : "SSL Secure"}<br />{lang === "bn" ? "পেমেন্ট" : "Payment"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 py-2.5 px-2 bg-zinc-50/80 dark:bg-zinc-950/80 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <CheckCircleIcon className="w-4 h-4 text-indigo-500" />
                    <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-400 text-center leading-tight">
                      {lang === "bn" ? "মানি-ব্যাক" : "Money-Back"}<br />{lang === "bn" ? "গ্যারান্টি" : "Guarantee"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 py-2.5 px-2 bg-zinc-50/80 dark:bg-zinc-950/80 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <PackageIcon className="w-4 h-4 text-violet-500" />
                    <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-400 text-center leading-tight">
                      {lang === "bn" ? "ফ্রি" : "Free"}<br />{lang === "bn" ? "শিপিং" : "Shipping"}
                    </span>
                  </div>
                </div>

                {/* Security footer */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <LockIcon className="w-3 h-3 text-zinc-400" />
                  <p className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 text-center">
                    {lang === "bn"
                      ? "আপনার পেমেন্ট সংক্রান্ত তথ্য ১০০% সুরক্ষিত ও এনক্রিপ্টেড"
                      : "Your payment information is encrypted and secure"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
