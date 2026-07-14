import type { Metadata } from "next";
import Link from "next/link";
import AIFeatureShowcase from "@/components/ai-feature-showcase";
import HowItWorks from "@/components/how-it-works";
import FeaturedProducts from "@/components/featured-products";
import FeaturedStorefronts from "@/components/featured-storefronts";
import PlatformStats from "@/components/platform-stats";
import Testimonials from "@/components/testimonials";
import FAQAccordion from "@/components/faq-accordion";
import FinalCTA from "@/components/final-cta";

export const metadata: Metadata = {
  title: "VendorNest - Premium Multi-Vendor Ecommerce SAAS",
  description: "Start, run, and scale your multi-vendor marketplace easily with VendorNest.",
  openGraph: {
    title: "VendorNest - Premium Multi-Vendor Ecommerce SAAS",
    description: "Start, run, and scale your multi-vendor marketplace easily with VendorNest.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "VendorNest Logo",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans transition-colors duration-300">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-12 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Column: Heading and Action CTAs */}
          <div className="text-left space-y-8 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs font-bold text-indigo-700 dark:text-indigo-400 select-none">
              <span className="w-2 h-2 rounded-full bg-indigo-650 animate-ping"></span>
              🚀 Next-Gen Multi-Vendor SAAS Platform
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1]">
                Scale Your Store <br />
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  With VendorNest
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-655 dark:text-zinc-400 leading-relaxed font-medium">
                Start, run, and grow your digital storefront under your own customized brand. Register as a verified merchant to sell globally, or browse high-quality items from our certified network vendors.
              </p>
            </div>

            {/* Call-to-Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/products"
                className="flex items-center justify-center h-13 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Start Shopping
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center h-13 px-8 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Open Your Store
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-200/80 dark:border-zinc-800 max-w-md">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">12k+</p>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">Live Products</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">1.2k+</p>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">Active Shops</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">99.9%</p>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">SLA Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive CSS Storefront Mockup */}
          <div className="relative w-full aspect-square max-w-[500px] mx-auto lg:ml-auto flex items-center justify-center select-none">
            {/* Radial Ambient Glow */}
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />            {/* Main Card: Product Preview */}
            <div className="w-[85%] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-white/60 dark:border-zinc-850 rounded-3xl p-6 shadow-2xl relative z-10 hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square w-full rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center relative overflow-hidden group">
                {/* Product Visual Mockup */}
                <div className="w-32 h-32 rounded-full bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 relative z-10 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-16 h-16 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-indigo-600 text-[10px] font-extrabold text-white uppercase tracking-wider">
                  Hot Release
                </div>
              </div>

              <div className="mt-5 space-y-2 text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wide">Electronics</p>
                    <h3 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50 mt-0.5">Premium Smart Device</h3>
                  </div>
                  <p className="text-lg font-black text-indigo-700 dark:text-indigo-400">$349.00</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 ml-1.5">(128 reviews)</span>
                </div>
              </div>
            </div>

            {/* Floating Widget 1: Live Analytics Sales */}
            <div className="absolute -top-4 -right-2 bg-zinc-950 text-white rounded-2xl p-4 shadow-xl border border-zinc-800 z-20 flex items-center gap-3.5 hover:scale-105 transition-all duration-300 animate-bounce [animation-duration:4s]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Store Sales</p>
                <h4 className="text-sm font-black mt-0.5">+$2,480.00</h4>
              </div>
            </div>

            {/* Floating Widget 2: Vendor Verified Seal */}
            <div className="absolute bottom-6 -left-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 shadow-2xl z-20 flex items-center gap-3 hover:scale-105 transition-all duration-300 animate-bounce [animation-duration:5s]">
              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-950 dark:text-zinc-50">Verified Merchant</p>
                <p className="text-[9px] font-extrabold text-indigo-650 dark:text-indigo-455 uppercase tracking-wider">VendorNest Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HowItWorks />
      <FeaturedProducts />

      {/* Dynamic Coupons Banner */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-12 border-t border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-linear-to-r from-emerald-500 to-teal-650 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="text-left space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                🏷️ Hot Discount Offers
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Clip Coupons & Save Instantly!
              </h2>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Browse our marketplace deals, clip seller coupons, and receive instant subtractions when checking out. Save up to 50% on selected merchant storefronts today.
              </p>
            </div>
            <Link
              href="/coupons"
              className="h-12 px-8 bg-white hover:bg-zinc-100 text-emerald-800 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center shrink-0"
            >
              Browse Active Coupons
            </Link>
          </div>
        </div>
      </section>

      <PlatformStats />
      <AIFeatureShowcase />
      <FeaturedStorefronts />
      <Testimonials />
      <FAQAccordion />
      <FinalCTA />
    </>
  );
}
