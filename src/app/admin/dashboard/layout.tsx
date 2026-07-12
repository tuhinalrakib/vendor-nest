import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - VendorNest",
  description: "VendorNest administrator control room dashboard and performance overview.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
