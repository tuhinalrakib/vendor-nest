import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Seller Portal",
  description: "Track customer orders, manage shipments, and view invoice details.",
};

export default function SellerOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
