import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 overflow-x-clip max-w-full relative">
      <Navbar />
      <main className="flex-1 flex flex-col pt-16 overflow-x-clip max-w-full">{children}</main>
      <Footer />
    </div>
  );
}
