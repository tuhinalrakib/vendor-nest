import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - VendorNest",
  description: "VendorNest Privacy Policy detailing data protection, buyer encryption standards, and seller data privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300 py-16">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            Last Updated: July 2026 &bull; Your privacy and data security are fundamental priorities.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 space-y-8 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">1. Information We Collect</h2>
            <p>
              We collect information necessary to facilitate multi-vendor transactions, including user account emails, business credentials, shipping addresses, and transaction metadata. Sensitive payment details (credit cards, bank account tokens) are securely processed via PCI-DSS compliant partners like Stripe.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">2. How We Use Data</h2>
            <p>
              Your data is utilized strictly for processing retail orders, managing merchant accounts, dispatching order notifications, preventing fraudulent activity, and refining built-in AI product recommendation models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">3. Merchant & Buyer Data Sharing</h2>
            <p>
              VendorNest only shares essential buyer shipping information (name, address, ordered items) with the specific merchant fulfilling the purchase. We never sell user data to third-party advertising networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">4. Cookies & Security Standards</h2>
            <p>
              We employ secure HTTP-only cookies and SSL encryption to maintain session integrity. Users can manage cookie preferences via their browser settings.
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Link href="/terms" className="hover:underline">View Terms of Service →</Link>
            <Link href="/contact" className="hover:underline">Contact Data Protection Officer →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
