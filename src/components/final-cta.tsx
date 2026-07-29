"use client";

import React from "react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden font-sans select-none">
      {/* Dynamic Background Mesh Grids & Ambient Glows */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Decorative Grid Line Patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-30" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10 text-center space-y-10">
        
        {/* Main CTA Block */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
            🚀 Accelerate Growth
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Ready to Launch Your Digital Store? <br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              আজই ব্যবসা প্রসার করুন
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-semibold">
            Join thousands of independent merchants growing their businesses online. Create your storefront, automate catalog uploads, and accept secure payments instantly.
          </p>
        </div>

        {/* Action CTAs Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-indigo-650/20 hover:shadow-indigo-650/30 hover:-translate-y-0.5 active:scale-95"
          >
            Open Store Free
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-200 font-bold text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 active:scale-95"
          >
            Start Shopping
          </Link>
        </div>

      </div>
    </section>
  );
}
