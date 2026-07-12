import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Orders - VendorNest",
  description: "Track customer orders, transactions, and fulfillment statuses.",
};

export default function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
