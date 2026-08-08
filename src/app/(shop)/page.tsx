import type { Metadata } from "next";
import Link from "next/link";
import HeroCarousel from "@/components/hero-carousel";
import CategoryGridShowcase from "@/components/category-grid-showcase";
import FlashSaleDeals from "@/components/flash-sale-deals";
import TrendingBestSellers from "@/components/trending-bestsellers";
import FeaturedStorefronts from "@/components/featured-storefronts";
import MerchantOnboardingBanner from "@/components/merchant-onboarding-banner";
import CouponsBanner from "@/components/coupons-banner";
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
      <CouponsBanner />

      <HowItWorks />
      <PlatformStats />
      <FinalCTA />
    </>
  );
}
