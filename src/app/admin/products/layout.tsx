import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Products - VendorNest",
  description: "Monitor and manage the platform product catalog and seller submissions.",
};

export default function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
