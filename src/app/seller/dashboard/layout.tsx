import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Seller Portal",
  description: "View sales analytics, revenue reports, and storefront performance stats.",
};

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
