import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product | Seller Portal",
  description: "Create new product listings, upload photos, and set catalog details.",
};

export default function SellerAddProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
