import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import CartDrawer from "@/components/navbar/CartDrawer";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vendor-nest.vercel.app"),
  title: {
    default: "VendorNest - Premium Multi-Vendor SAAS Ecommerce Platform",
    template: "%s | VendorNest",
  },
  description: "Start, run, and grow your digital storefront under your own custom brand. Register as a verified merchant or shop quality products.",
  keywords: ["multi-vendor", "ecommerce", "saas", "marketplace", "online store", "vendornest"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "VendorNest - Multi-Vendor SAAS Ecommerce",
    description: "Launch your own digital brand and start selling globally.",
    url: "/",
    siteName: "VendorNest",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "VendorNest Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VendorNest - Multi-Vendor SAAS Ecommerce",
    description: "Launch your own digital brand and start selling globally.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
