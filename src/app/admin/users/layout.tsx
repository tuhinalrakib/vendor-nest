import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Users - VendorNest",
  description: "Manage registered users, user profiles, and platform roles.",
};

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
