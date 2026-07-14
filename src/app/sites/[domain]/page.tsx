import React from "react";
import type { Metadata } from "next";
import { AIReviewSummary, AIRecommendations } from "@/components/ai-storefront";
import StorefrontNavbar from "@/components/navbar/StorefrontNavbar";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const vendorName = domain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    title: `${vendorName} Store - Powered by VendorNest`,
    description: `Shop high-quality products from ${vendorName} Store on VendorNest SAAS multi-vendor platform.`,
  };
}

export default async function TenantPage({ params }: PageProps) {
  const { domain } = await params;
  const vendorName = domain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <section className="text-center md:text-left py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-xs font-bold text-indigo-650 dark:text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
              Official Vendor Site
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Welcome to <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-650 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">{vendorName}</span> Storefront
            </h1>
            <p className="text-lg text-zinc-650 dark:text-zinc-400 leading-relaxed font-medium">
              Discover unique high-quality products curated just for you. Seamless payments, secure checkout, and fast delivery guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/products" className="w-full sm:w-auto h-12 px-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center shadow-lg shadow-indigo-600/25 dark:shadow-indigo-600/30 transition-all">
                Shop Collection
              </Link>
              <button className="w-full sm:w-auto h-12 px-8 rounded-lg border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors font-semibold">
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full md:w-[450px] aspect-square rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 backdrop-blur-sm p-8 flex flex-col justify-between shadow-xl dark:shadow-2xl relative overflow-hidden group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-650/5 dark:bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-650/5 dark:bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-indigo-650 dark:text-indigo-400 tracking-wider uppercase">Featured Product</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-750">NEW ARRIVAL</span>
            </div>
            
            <div className="space-y-4">
              <div className="w-full h-48 rounded-lg bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 border border-zinc-200/50 dark:border-zinc-800/50">
                <svg className="w-16 h-16 text-zinc-400 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors text-left">Premium Wireless Headphones</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-left">Noise cancelling, 40h battery, spatial audio.</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-150 dark:border-zinc-800/80 pt-4">
              <span className="text-xl font-bold text-zinc-950 dark:text-white">$249.99</span>
              <button className="h-9 px-4 rounded bg-zinc-950 dark:bg-white hover:bg-zinc-850 dark:hover:bg-zinc-250 text-white dark:text-black font-bold text-xs transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </section>

        {/* AI Product Insights Section */}
        <section className="border-t border-zinc-200 dark:border-zinc-900 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIRecommendations productId="prod-1" />
          </div>
          <div>
            <AIReviewSummary productId="prod-1" />
          </div>
        </section>

        {/* Dynamic Shop Details grid */}
        <section className="border-t border-zinc-200 dark:border-zinc-900 py-16">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-8 tracking-tight text-left">Our Premium Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Summer Style", items: "12 products", bg: "from-amber-500/10 to-orange-500/10 border-orange-500/20" },
              { title: "Essential Tech", items: "8 products", bg: "from-blue-500/10 to-indigo-500/10 border-blue-500/20" },
              { title: "Home Design", items: "15 products", bg: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20" }
            ].map((col, idx) => (
              <div key={idx} className={`p-6 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm ${col.bg} flex flex-col justify-between h-40 hover:scale-[1.01] transition-transform text-left`}>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{col.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">{col.items}</p>
                </div>
                <Link href="/products" className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
                  Browse Collection
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#09090b] py-8 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} {vendorName} Store. Powered by VendorNest SAAS.</p>
        </div>
      </footer>

    </>
  );
}
