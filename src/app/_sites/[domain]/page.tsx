import React from "react";
import type { Metadata } from "next";
import { AIReviewSummary, AIRecommendations, AIChatSupport } from "@/components/ai-storefront";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const vendorName = domain.charAt(0).toUpperCase() + domain.slice(1);
  return {
    title: `${vendorName} Store - Powered by VendorNest`,
    description: `Shop high-quality products from ${vendorName} Store on VendorNest SAAS multi-vendor platform.`,
  };
}

export default async function TenantPage({ params }: PageProps) {
  const { domain } = await params;
  const vendorName = domain.charAt(0).toUpperCase() + domain.slice(1);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Decorative gradient header bg */}
      <div className="absolute top-0 inset-x-0 h-80 bg-linaer-to-b from-indigo-950/20 via-violet-950/10 to-transparent pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl backdrop-saturate-150 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              {vendorName[0]}
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              {vendorName} Store
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Products</Link>
            <Link href="#" className="hover:text-white transition-colors">Categories</Link>
            <Link href="#" className="hover:text-white transition-colors">About Us</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <section className="text-center md:text-left py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Official Vendor Site
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">{vendorName}</span> Storefront
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Discover unique high-quality products curated just for you. Seamless payments, secure checkout, and fast delivery guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all">
                Shop Collection
              </button>
              <button className="w-full sm:w-auto h-12 px-8 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full md:w-[450px] aspect-square rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase">Featured Product</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">NEW ARRIVAL</span>
            </div>
            
            <div className="space-y-4">
              <div className="w-full h-48 rounded-lg bg-linear-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                <svg className="w-16 h-16 text-zinc-700 group-hover:text-zinc-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">Premium Wireless Headphones</h3>
                <p className="text-sm text-zinc-500">Noise cancelling, 40h battery, spatial audio.</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-800/80 pt-4">
              <span className="text-xl font-bold text-white">$249.99</span>
              <button className="h-9 px-4 rounded bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </section>

        {/* AI Product Insights Section */}
        <section className="border-t border-zinc-900 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIRecommendations productId="prod-1" />
          </div>
          <div>
            <AIReviewSummary productId="prod-1" />
          </div>
        </section>

        {/* Dynamic Shop Details grid */}
        <section className="border-t border-zinc-900 py-16">
          <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Our Premium Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Summer Style", items: "12 products", bg: "from-amber-500/10 to-orange-500/10 border-orange-500/20" },
              { title: "Essential Tech", items: "8 products", bg: "from-blue-500/10 to-indigo-500/10 border-blue-500/20" },
              { title: "Home Design", items: "15 products", bg: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20" }
            ].map((col, idx) => (
              <div key={idx} className={`p-6 rounded-xl border bg-zinc-900/30 backdrop-blur-sm ${col.bg} flex flex-col justify-between h-40 hover:scale-[1.01] transition-transform`}>
                <div>
                  <h3 className="text-lg font-bold text-white">{col.title}</h3>
                  <p className="text-sm text-zinc-400">{col.items}</p>
                </div>
                <Link href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
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
      <footer className="border-t border-zinc-900 bg-[#09090b] py-8 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} {vendorName} Store. Powered by VendorNest SAAS.</p>
        </div>
      </footer>

      {/* AI Chat Support widget */}
      <AIChatSupport />
    </div>
  );
}
