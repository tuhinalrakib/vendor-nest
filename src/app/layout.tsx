import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import CartDrawer from "@/components/navbar/CartDrawer";
import { AIChatSupport } from "@/components/ai-storefront";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://vendor-nest.vercel.app"),
  title: {
    default: "VendorNest - Premium Multi-Vendor SAAS Ecommerce Platform",
    template: "%s | VendorNest",
  },
  description: "Start, run, and grow your digital storefront under your own custom brand. Register as a verified merchant or shop quality products.",
  keywords: [
    "multi-vendor", 
    "ecommerce", 
    "saas", 
    "marketplace", 
    "online store", 
    "vendornest"
  ],
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
        width: 1200,
        height: 630,
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
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <AIChatSupport />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
