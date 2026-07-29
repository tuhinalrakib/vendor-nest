import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - VendorNest",
  description: "VendorNest Terms of Service, merchant guidelines, platform commission terms, and buyer rights.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            Last Updated: July 2026 &bull; Effective for all VendorNest merchants and retail buyers.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 space-y-8 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the VendorNest multi-vendor ecommerce SAAS platform, creating a merchant storefront, or purchasing goods from network sellers, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">2. Merchant Obligations & Accounts</h2>
            <p>
              Merchants registering on VendorNest are responsible for maintaining the security of their credentials, accurately representing product inventory, fulfilling customer orders promptly, and adhering to local retail regulations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">3. Platform Fees & Payouts</h2>
            <p>
              VendorNest processes transaction payments on behalf of sellers. Platform commission fees (deducted automatically at checkout) depend on the merchant's active plan tier (Starter, Growth, or Scale). Merchant payouts are issued via Stripe Connect or designated local bank transfers according to weekly schedules.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">4. Prohibited Content & Counterfeiting</h2>
            <p>
              VendorNest maintains zero tolerance for counterfeit merchandise, illegal contraband, or deceptive listings. Stores violating intellectual property rights will face immediate suspension and balance hold pending review.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">5. Limitation of Liability</h2>
            <p>
              VendorNest provides the multi-vendor marketplace platform "as is". While we implement high-uptime architecture and AI monitoring engines, we do not assume direct liability for individual merchant shipping delays or third-party carrier failures.
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Link href="/privacy" className="hover:underline">View Privacy Policy →</Link>
            <Link href="/contact" className="hover:underline">Contact Legal Support →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
