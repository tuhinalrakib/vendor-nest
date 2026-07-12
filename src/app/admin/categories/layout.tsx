import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Categories - VendorNest",
  description: "Configure and moderate platform-wide product categories and collections.",
};

export default function AdminCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
