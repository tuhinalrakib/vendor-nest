import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Seller Portal",
  description: "Analyze shop visits, customer conversion rates, and revenue performance charts.",
};

export default function SellerAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
