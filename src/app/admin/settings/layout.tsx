import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings - VendorNest",
  description: "Configure platform settings, payment gateways, and system parameters.",
};

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
