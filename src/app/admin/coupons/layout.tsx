import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Coupons - VendorNest",
  description: "Manage promotional coupons, platform discounts, and marketing campaigns.",
};

export default function AdminCouponsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
