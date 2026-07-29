import type { Metadata } from "next";
import Testimonials from "@/components/testimonials";
import Link from "next/link";

export const metadata: Metadata = {
  title: "বিক্রেতা ও ক্রেতাদের রিভিউ - VendorNest Reviews & Success Stories",
  description: "Read real reviews, ratings, and success stories from verified merchants and retail customers on VendorNest.",
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Top Breadcrumb & Metrics */}
      <div className="max-w-5xl mx-auto pt-8 px-6 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Home
        </Link>

        {/* Review Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">99.4%</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Satisfaction Score</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">12,500+</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Verified Sellers</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">450K+</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Completed Orders</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">24/7</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">AI Support SLA</p>
          </div>
        </div>
      </div>

      {/* Main Testimonials component */}
      <Testimonials />

      {/* Share Review CTA Banner */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-linear-to-tr from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight relative z-10">Are you selling on VendorNest?</h3>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto leading-relaxed relative z-10">
            Share your storefront journey with our seller community and get featured on our global merchant stories showcase.
          </p>
          <div className="pt-2 flex justify-center gap-4 relative z-10">
            <Link
              href="/become-seller"
              className="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-indigo-900 font-extrabold text-xs shadow-md transition-all"
            >
              Start Selling Today
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-extrabold text-xs border border-indigo-500/50 transition-all"
            >
              Submit Your Story
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
