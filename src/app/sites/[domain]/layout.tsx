import React from "react";
import StorefrontNavbar from "@/components/navbar/StorefrontNavbar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    domain: string;
  }>;
}

export default async function TenantLayout({ children, params }: LayoutProps) {
  const { domain } = await params;
  const vendorName = domain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-800 dark:text-zinc-150 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Decorative gradient header bg */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/20 dark:via-transparent dark:to-transparent pointer-events-none" />

      {/* Shared Storefront Navbar */}
      <StorefrontNavbar vendorName={vendorName} domain={domain} />

      {children}
    </div>
  );
}
