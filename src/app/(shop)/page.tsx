import type { Metadata } from "next";
import Link from "next/link";
import HeroCarousel from "@/components/hero-carousel";
import CategoryGridShowcase from "@/components/category-grid-showcase";
import FlashSaleDeals from "@/components/flash-sale-deals";
import TrendingBestSellers from "@/components/trending-bestsellers";
import FeaturedStorefronts from "@/components/featured-storefronts";
import MerchantOnboardingBanner from "@/components/merchant-onboarding-banner";
import HowItWorks from "@/components/how-it-works";
import PlatformStats from "@/components/platform-stats";
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
      <HeroCarousel />
      <CategoryGridShowcase />
      <FlashSaleDeals />
      <TrendingBestSellers />
      <FeaturedStorefronts />
      <MerchantOnboardingBanner />

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

      <HowItWorks />
      <PlatformStats />
      <FinalCTA />
    </>
  );
}
