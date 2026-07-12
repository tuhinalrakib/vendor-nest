import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Seller Portal",
  description: "Configure store profile details, shop subdomains, and customer support settings.",
};

export default function SellerSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
