import type { Metadata } from "next";
import FAQAccordion from "@/components/faq-accordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - VendorNest",
  description: "Find answers to commonly asked questions about shop setup, AI tools, payout cycles, and custom domains.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Top Breadcrumb */}
      <div className="max-w-4xl mx-auto pt-8 px-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>

      <FAQAccordion />

      {/* Support CTA Banner */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Still have unanswered questions?</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Our merchant onboarding specialists and technical support team are here to assist you 24/7.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="px-6 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-all"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
