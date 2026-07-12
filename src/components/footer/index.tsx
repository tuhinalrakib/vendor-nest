"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/Logo";

export default function Footer() {
  const { user, isAuthenticated } = useAuth();
  const isSeller = isAuthenticated && user?.role === "seller";
  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 text-zinc-600 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section / Grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Slogan Column */}
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-sm text-zinc-500 leading-relaxed">
              The next-generation multi-vendor SAAS ecommerce platform empowering merchants and buyers worldwide.
            </p>
          </div>

          {/* Buying Column */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
              Buy on VendorNest
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-indigo-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shops" className="hover:text-indigo-600 transition-colors">
                  Browse Shops
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-indigo-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-indigo-600 transition-colors">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Selling Column */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
              Sell on VendorNest
            </h3>
            <ul className="space-y-2 text-sm">
              {(!isAuthenticated || user?.role === "customer") && (
                <li>
                  <Link href="/become-seller" className="hover:text-indigo-600 transition-colors">
                    Become a Seller
                  </Link>
                </li>
              )}
              {isSeller && (
                <li>
                  <Link href="/seller/dashboard" className="hover:text-indigo-600 transition-colors">
                    Seller Dashboard
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors">
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link href="/seller/pricing" className="hover:text-indigo-600 transition-colors">
                  Merchant Plans
                </Link>
              </li>
              <li>
                <Link href="/seller/faq" className="hover:text-indigo-600 transition-colors">
                  Seller Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
              Help & Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-indigo-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} VendorNest Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-zinc-600 transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-zinc-600 transition-colors">
              Facebook
            </Link>
            <Link href="#" className="hover:text-zinc-600 transition-colors">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
