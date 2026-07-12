import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sellers - VendorNest",
  description: "Moderate and manage merchant accounts and seller verifications.",
};

export default function AdminSellersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
