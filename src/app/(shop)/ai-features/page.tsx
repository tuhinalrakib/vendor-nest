import type { Metadata } from "next";
import AIFeatureShowcase from "@/components/ai-feature-showcase";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integrated AI Engines - Supercharge Commerce | VendorNest",
  description: "Explore VendorNest's integrated AI engines: automatic product descriptions, smart SEO generator, catalog search, and sentiment review analysis.",
};

export default function AIFeaturesPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto pt-8 px-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main AI Feature Showcase Component */}
      <AIFeatureShowcase />

      {/* CTA Footer */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Ready to automate your store with AI?</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Join thousands of smart merchants leveraging our built-in AI generators today.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/become-seller"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Get Free Merchant AI Credits
            </Link>
            <Link
              href="/seller/pricing"
              className="px-6 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs transition-all"
            >
              View AI Credit Plans
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
