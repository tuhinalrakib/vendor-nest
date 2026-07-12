"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] bg-zinc-50 dark:bg-black font-sans text-center px-6">
      <div className="relative max-w-md w-full p-8 bg-white dark:bg-[#121212] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Glow background */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Something went wrong
        </h2>
        
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        {error.message && (
          <div className="mb-6 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left">
            <span className="text-xs font-semibold text-zinc-400 uppercase block mb-1">Error message:</span>
            <code className="text-xs text-red-600 dark:text-red-400 font-mono break-all">{error.message}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 h-11 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 h-11 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
