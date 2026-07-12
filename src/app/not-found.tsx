import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] bg-zinc-50 dark:bg-black font-sans text-center px-6">
      <div className="relative max-w-md w-full p-8 bg-white dark:bg-[#121212] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Glow background */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* 404 Text & Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-500 dark:text-indigo-400 mb-6">
          PAGE NOT FOUND
        </div>

        <h1 className="text-7xl font-extrabold tracking-tighter dark:text-zinc-50 mb-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Page does not exist
        </h2>
        
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 h-11 flex items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="flex-1 h-11 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
