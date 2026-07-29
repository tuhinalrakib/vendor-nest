import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center - VendorNest Customer & Seller Support",
  description: "Find guides, seller tutorials, order tracking help, and store management resources in the VendorNest Help Center.",
};

const helpCategories = [
  {
    icon: "🛍️",
    title: "Buying & Shopping",
    description: "Order tracking, payments, refund policies, and clipping discount coupons.",
    links: [
      { text: "Track your order status", href: "/orders" },
      { text: "Clip & apply discount coupons", href: "/coupons" },
      { text: "Customer buyer protections", href: "/terms" },
    ],
  },
  {
    icon: "🏪",
    title: "Storefront & Selling",
    description: "Setting up your shop, adding products, custom domain configuration, and inventory.",
    links: [
      { text: "How to open a merchant store", href: "/become-seller" },
      { text: "Seller FAQs & guides", href: "/seller/faq" },
      { text: "Merchant plan pricing & limits", href: "/seller/pricing" },
    ],
  },
  {
    icon: "🤖",
    title: "AI Tools & Automation",
    description: "Using AI product description generators, SEO optimization, and review insights.",
    links: [
      { text: "Integrated AI features overview", href: "/ai-features" },
      { text: "Generating SEO meta titles", href: "/ai-features" },
      { text: "AI review sentiment summaries", href: "/reviews" },
    ],
  },
  {
    icon: "💳",
    title: "Payments & Payouts",
    description: "Stripe Connect, payout schedules, platform fees, and local banking options.",
    links: [
      { text: "Stripe Connect setup guide", href: "/seller/faq" },
      { text: "Weekly payout schedule details", href: "/seller/faq" },
      { text: "Supported currencies & fees", href: "/seller/pricing" },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Hero Header */}
      <div className="bg-linear-to-b from-indigo-900/10 via-zinc-50 dark:via-zinc-950 to-transparent py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            VendorNest Support Hub
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium max-w-lg mx-auto">
            Search our knowledge base or select a topic below to find quick answers for shoppers and store owners.
          </p>

          {/* Quick Links Row */}
          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <span className="text-zinc-400">Popular:</span>
            <Link href="/faq" className="text-indigo-600 dark:text-indigo-400 hover:underline">FAQs</Link>
            <span>&bull;</span>
            <Link href="/seller/faq" className="text-indigo-600 dark:text-indigo-400 hover:underline">Seller Guides</Link>
            <span>&bull;</span>
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>

      {/* Help Categories Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpCategories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="text-4xl">{cat.icon}</div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{cat.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {cat.description}
              </p>
              <ul className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                {cat.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>→</span> {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support Banner */}
        <div className="mt-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-extrabold">Need customized assistance?</h3>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium">
              Send us a message and our support team will respond within 24 hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-white text-indigo-700 hover:bg-zinc-100 rounded-2xl text-xs font-black shadow-md transition-all shrink-0"
          >
            Open Support Ticket
          </Link>
        </div>
      </div>
    </main>
  );
}
