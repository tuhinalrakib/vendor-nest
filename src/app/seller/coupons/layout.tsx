import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupons | Seller Portal",
  description: "Configure store discount coupons, manage platform promo codes, and run campaigns.",
};

export default function SellerCouponsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
