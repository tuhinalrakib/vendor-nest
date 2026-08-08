"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
  tp: (item: any, field?: "name" | "description" | "title") => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionary: Record<string, Record<Language, string>> = {
  // Navbar & Nav Links
  "nav.shops": { en: "Shops", bn: "দোকানসমূহ" },
  "nav.products": { en: "Products", bn: "পণ্যসামগ্রী" },
  "nav.categories": { en: "Categories", bn: "ক্যাটাগরি" },
  "nav.coupons": { en: "Coupons", bn: "কুপনসমূহ" },
  "nav.becomeSeller": { en: "Become a Seller", bn: "মার্চেন্ট রেজিস্ট্রেশন" },
  "nav.adminDashboard": { en: "Admin Dashboard", bn: "এডমিন ড্যাশবোর্ড" },
  "nav.sellerDashboard": { en: "Seller Dashboard", bn: "সেলার ড্যাশবোর্ড" },
  "nav.searchPlaceholder": { en: "Search products, stores...", bn: "পণ্য বা স্টোর খুঁজুন..." },
  "nav.cart": { en: "Cart", bn: "কার্ট" },
  "nav.login": { en: "Sign In", bn: "সাইন ইন" },
  "nav.register": { en: "Register", bn: "রেজিস্টার" },
  "nav.logout": { en: "Sign Out", bn: "সাইন আউট" },
  "nav.myOrders": { en: "My Orders", bn: "আমার অর্ডারসমূহ" },
  "nav.accountSettings": { en: "Account Settings", bn: "অ্যাকাউন্ট সেটিংস" },

  // Hero & Homepage
  "hero.badge": { en: "Multi-Vendor Commerce Redefined", bn: "মাল্টি-ভেন্ডর কমার্সের নতুন দিগন্ত" },
  "hero.title": { en: "Discover & Shop Premium Products Across Top Sellers", bn: "সেরা সেলারদের থেকে প্রিমিয়াম পণ্য কিনুন" },
  "hero.subtitle": { en: "A unified marketplace connecting verified independent vendors with passionate buyers worldwide.", bn: "বিশ্বস্ত ভেন্ডর ও গ্রাহকদের সংযোগকারী সেরা অনলাইন মার্কেটপ্লেস।" },
  "hero.exploreBtn": { en: "Explore Products", bn: "পণ্যসমূহ দেখুন" },
  "hero.becomeVendorBtn": { en: "Start Selling", bn: "বিক্রি শুরু করুন" },

  // Sections
  "section.trending": { en: "Trending & Best Sellers", bn: "জনপ্রিয় ও বেস্ট সেলিং পণ্য" },
  "section.featuredCategories": { en: "Explore Categories", bn: "ক্যাটাগরি সমুহ" },
  "section.featuredShops": { en: "Verified Merchant Shops", bn: "ভেরিফায়েড মার্চেন্ট শপসমূহ" },
  "section.flashSale": { en: "Flash Sale & Limited Deals", bn: "ফ্ল্যাশ সেল ও স্পেশাল অফার" },
  "section.allProducts": { en: "All Products Catalogue", bn: "সকল প্রোডাক্ট ক্যাটালগ" },

  // Buttons & Common UI
  "btn.addToCart": { en: "Add to Cart", bn: "কার্টে যোগ করুন" },
  "btn.buyNow": { en: "Buy Now", bn: "এখনই কিনুন" },
  "btn.viewDetails": { en: "View Details", bn: "বিস্তারিত দেখুন" },
  "btn.applyCoupon": { en: "Apply Coupon", bn: "কুপন ব্যবহার করুন" },
  "btn.checkout": { en: "Proceed to Checkout", bn: "চেকআউট করুন" },
  "btn.save": { en: "Save Changes", bn: "সংরক্ষণ করুন" },
  "btn.edit": { en: "Edit", bn: "সম্পাদনা" },
  "btn.delete": { en: "Delete", bn: "মুছে ফেলুন" },
  "btn.cancel": { en: "Cancel", bn: "বাতিল" },
  "btn.close": { en: "Close", bn: "বন্ধ করুন" },

  // Status & Badges
  "badge.approved": { en: "Approved", bn: "অনুমোদিত" },
  "badge.pending": { en: "Pending Moderation", bn: "অপেক্ষমাণ" },
  "badge.flagged": { en: "Flagged / Rejected", bn: "প্রত্যাখ্যান করা হয়েছে" },
  "badge.featured": { en: "Featured", bn: "ফিচার্ড" },
  "badge.popular": { en: "Popular", bn: "জনপ্রিয়" },
  "badge.newArrival": { en: "New Arrival", bn: "নতুন কালেকশন" },
  "badge.digital": { en: "Digital Product", bn: "ডিজিটাল প্রোডাক্ট" },

  // Cart & Checkout
  "cart.title": { en: "Your Shopping Cart", bn: "আপনার শপিং কার্ট" },
  "cart.empty": { en: "Your cart is empty", bn: "আপনার কার্ট খালি" },
  "cart.subtotal": { en: "Subtotal", bn: "মোট মূল্য" },
  "cart.shipping": { en: "Shipping Fee", bn: "শিপিং চার্জ" },
  "cart.total": { en: "Total", bn: "সর্বমোট" },
  "checkout.title": { en: "Complete Your Order", bn: "অর্ডার সম্পন্ন করুন" },
  "checkout.shippingAddress": { en: "Shipping Address", bn: "শিপিং ঠিকানা" },
  "checkout.paymentMethod": { en: "Payment Method", bn: "পেমেন্ট পদ্ধতি" },
  "checkout.placeOrder": { en: "Place Order Now", bn: "অর্ডার কনফার্ম করুন" },

  // Sidebar & Hub
  "sidebar.popularCategories": { en: "POPULAR CATEGORIES", bn: "জনপ্রিয় ক্যাটাগরি" },
  "sidebar.viewAll": { en: "View All →", bn: "সব দেখুন →" },
  "hub.badge": { en: "MERCHANT HUB", bn: "মার্চেন্ট হাব" },
  "hub.title": { en: "Start Selling Globally", bn: "বিশ্বজুড়ে বিক্রি শুরু করুন" },
  "hub.subtitle": { en: "Create your store in under 2 minutes with AI description generators & zero setup fee.", bn: "এআই দিয়ে মাত্র ২ মিনিটে আপনার স্টোর তৈরি করুন।" },
  "hub.registerBtn": { en: "Register Store Now", bn: "এখনই স্টোর খুলুন" },

  // User Roles
  "role.customer": { en: "CUSTOMER", bn: "গ্রাহক" },
  "role.seller": { en: "SELLER", bn: "বিক্রেতা" },
  "role.admin": { en: "ADMIN", bn: "এডমিন" },

  // Merchant Onboarding Banner
  "banner.portalBadge": { en: "VendorNest Merchant Portal", bn: "ভেন্ডরনেস্ট মার্চেন্ট পোর্টাল" },
  "banner.title1": { en: "Earn Money Selling on VendorNest", bn: "ভেন্ডরনেস্টে পণ্য বিক্রি করে আয় করুন" },
  "banner.title2": { en: "Register as a Verified Seller Today", bn: "আজই ভেরিফায়েড মার্চেন্ট হিসেবে যুক্ত হন" },
  "banner.zeroFee": { en: "Zero Setup Fee", bn: "জিরো সেটআপ ফি" },
  "banner.aiGen": { en: "Built-in Gemini AI Generator", bn: "বিল্ট-ইন জেমিনি এআই জেনারেটর" },
  "banner.payouts": { en: "Automated Weekly Payouts", bn: "অটোমেটেড পে-আউট সুবিধা" },
  "banner.registerBtn": { en: "Register as Verified Seller →", bn: "মার্চেন্ট হিসেবে রেজিস্টার করুন →" },
  "banner.pricingBtn": { en: "Explore Merchant Plans", bn: "মার্চেন্ট প্ল্যানগুলো দেখুন" },

  // Coupons Banner Section
  "couponsBanner.badge": { en: "🏷️ Hot Discount Offers", bn: "🏷️ বিশেষ ডিসকাউন্ট অফার" },
  "couponsBanner.title": { en: "Clip Coupons & Save Instantly!", bn: "কুপন ব্যবহার করুন এবং তাত্ক্ষণিক ছাড় পান!" },
  "couponsBanner.subtitle": { en: "Browse our marketplace deals, clip seller coupons, and receive instant subtractions when checking out. Save up to 50% on selected merchant storefronts today.", bn: "আমাদের মার্কেটপ্লেসের বিশেষ অফারগুলো দেখুন, সেলার কুপন সংগ্রহ করুন এবং চেকআউটে ৫০% পর্যন্ত তাত্ক্ষণিক ছাড় উপভোগ করুন।" },
  "couponsBanner.btn": { en: "Browse Active Coupons", bn: "একটিভ কুপনসমূহ দেখুন" },

  // Category Grid Showcase
  "categoryGrid.badge": { en: "🏷️ Curated Collections", bn: "🏷️ নির্বাচিত কালেকশন" },
  "categoryGrid.title": { en: "Explore Popular Marketplace Categories", bn: "জনপ্রিয় মার্কেটপ্লেস ক্যাটাগরি" },
  "categoryGrid.subtitle": { en: "Find top-selling products, seasonal trends, and verified vendor storefront deals.", bn: "টপ-সেলিং পণ্য, সিজনাল ট্রেন্ড ও ভেরিফায়েড মার্চেন্টদের বিশেষ অফার খুঁজুন।" },
  "categoryGrid.allCategories": { en: "All Categories", bn: "সকল ক্যাটাগরি" },
  "categoryGrid.exploreCollection": { en: "Explore Collection", bn: "কালেকশন দেখুন" },

  // Flash Sale Section
  "flashSale.badge": { en: "⚡ Limited Time Flash Sale", bn: "⚡ সীমিত সময়ের ফ্ল্যাশ সেল" },
  "flashSale.title": { en: "Today's Hot Deals & Mega Savings", bn: "আজকের হট ডিল ও মেগা সেভিংস" },
  "flashSale.subtitle": { en: "Hurry! Claim up to 55% OFF on selected verified merchant stock. Deals refresh daily.", bn: "দ্রুত করুন! ভেরিফায়েড মার্চেন্ট পণ্যে ৫৫% পর্যন্ত ডিসকাউন্ট পান। অফারসমূহ প্রতিদিন আপডেট হয়।" },
  "flashSale.endsIn": { en: "Ends In:", bn: "সময় বাকি:" },
  "flashSale.hours": { en: "Hours", bn: "ঘণ্টা" },
  "flashSale.mins": { en: "Mins", bn: "মিনিট" },
  "flashSale.secs": { en: "Secs", bn: "সেকেন্ড" },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("vendornest_lang") as Language;
    if (saved === "en" || saved === "bn") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("vendornest_lang", newLang);
  };

  const toggleLang = () => {
    const nextLang = lang === "en" ? "bn" : "en";
    setLang(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    if (dictionary[key] && dictionary[key][lang]) {
      return dictionary[key][lang];
    }
    return fallback || key;
  };

  const tp = (item: any, field: "name" | "description" | "title" = "name"): string => {
    if (!item) return "";
    if (lang === "bn") {
      if (field === "name" || field === "title") {
        return item.name_bn || item.title_bn || item.name || item.title || "";
      }
      if (field === "description") {
        return item.description_bn || item.description || "";
      }
    }
    return item[field] || item.name || item.title || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, tp }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
