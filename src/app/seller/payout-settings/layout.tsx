import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payout Settings | Seller Portal",
  description: "Configure Stripe Connect, manage payouts, and update bank settings.",
};

export default function SellerPayoutSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
