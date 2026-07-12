import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Seller Portal",
  description: "Manage your storefront catalog, edit product details, and configure tags.",
};

export default function SellerProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
