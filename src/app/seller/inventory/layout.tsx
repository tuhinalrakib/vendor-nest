import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory | Seller Portal",
  description: "Audit stock levels, update product inventory, and configure low stock alert thresholds.",
};

export default function SellerInventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
