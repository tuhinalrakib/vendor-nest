"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  ChevronDownIcon,
  LogOutIcon,
  DashboardIcon,
  StoreIcon,
  CartIcon,
  TrashIcon,
  OrdersIcon,
  UsersIcon,
  SettingsIcon,
} from "@/components/icons";

export default function Navbar() {
  const { user, logout, isLoading, maintenanceMode } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  // Initials for avatar profile icon
  const getInitials = () => {
    if (!user) return "";
    if (user.full_name) {
      const parts = user.full_name.trim().split(/\s+/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  return (
    <>
      {maintenanceMode && (
        <div className="w-full bg-amber-500 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <span>⚠️</span>
          <span><strong>System Under Scheduled Maintenance:</strong> We are currently upgrading our platform. Checkout and purchasing are temporarily paused. We'll be back online shortly!</span>
        </div>
      )}
      <nav className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo />

        {/* Navigation links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600">
          <Link href="/shops" className="hover:text-indigo-600 transition-colors">
            Shops
          </Link>
          <Link href="/products" className="hover:text-indigo-600 transition-colors">
            Products
          </Link>
          <Link href="/categories" className="hover:text-indigo-600 transition-colors">
            Categories
          </Link>
          <Link href="/coupons" className="hover:text-indigo-600 transition-colors">
            Coupons
          </Link>

          {/* Dynamic Action Link depending on User Role */}
          {isLoading ? (
            <div className="w-28 h-4 bg-zinc-100 animate-pulse rounded-md" />
          ) : user ? (
            user.role === "admin" ? (
              <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-700 transition-colors font-bold">
                Admin Dashboard
              </Link>
            ) : user.role === "seller" ? (
              <Link href="/seller/dashboard" className="text-indigo-600 hover:text-indigo-700 transition-colors font-bold">
                Seller Dashboard
              </Link>
            ) : null
          ) : (
            <Link href="/become-seller" className="text-indigo-600 hover:text-indigo-700 transition-colors font-bold">
              Become a Seller
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm relative">
          <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products, brands, shops..."
            className="w-full h-10 pl-10 pr-4 rounded-full border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
          />
        </div>

        {/* Actions (Sign In / Register or Dynamic User Profile Menu) */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-50 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer mr-1 flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <CartIcon className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 rounded-full bg-indigo-600 text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-white shadow-sm z-10">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {isLoading ? (
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200/60 shadow-xs animate-pulse">
              <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs font-semibold text-zinc-500 leading-none">Loading...</span>
            </div>
          ) : user ? (
            <div className="relative">
              {/* Profile Trigger Button */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-zinc-50 border border-zinc-200/80 transition-all duration-200 text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-indigo-650 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-indigo-400">
                  {getInitials()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-zinc-900 leading-tight">
                    {user.full_name || user.email.split("@")[0]}
                  </p>
                  <p className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider leading-none mt-0.5">
                    {user.role}
                  </p>
                </div>
                <ChevronDownIcon className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div
                    onClick={() => setShowProfileMenu(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right">
                    <div className="px-3.5 py-2.5 border-b border-zinc-100 mb-1">
                      <span className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">Signed in as</span>
                      <span className="block text-xs font-bold text-zinc-900 truncate">{user.full_name || "Nest User"}</span>
                      <span className="block text-[10px] text-zinc-500 truncate mt-0.5">{user.email}</span>
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded mt-2 uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>

                    {/* Role specific Dashboard and Settings buttons */}
                    {user.role === "admin" && (
                      <>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/admin/dashboard");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left"
                        >
                          <DashboardIcon className="w-4 h-4 text-zinc-400" />
                          Admin Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/admin/users");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left"
                        >
                          <UsersIcon className="w-4 h-4 text-zinc-400" />
                          Users Control
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/admin/settings");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left"
                        >
                          <SettingsIcon className="w-4 h-4 text-zinc-400" />
                          Platform Settings
                        </button>
                      </>
                    )}

                    {user.role === "seller" && (
                      <>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/seller/dashboard");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left"
                        >
                          <StoreIcon className="w-4 h-4 text-zinc-400" />
                          Seller Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/seller/inventory");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left"
                        >
                          <OrdersIcon className="w-4 h-4 text-zinc-400" />
                          Inventory
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/seller/settings");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left"
                        >
                          <SettingsIcon className="w-4 h-4 text-zinc-400" />
                          Shop Settings
                        </button>
                      </>
                    )}

                    {user.role === "customer" && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push("/orders");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left"
                      >
                        <OrdersIcon className="w-4 h-4 text-zinc-400" />
                        My Orders
                      </button>
                    )}

                    <div className="h-px bg-zinc-100 my-1" />

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push("/");
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                    >
                      <LogOutIcon className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="h-10 px-4 flex items-center justify-center text-sm font-semibold text-zinc-700 hover:text-zinc-950 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="h-10 px-5 flex items-center justify-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors md:hidden active:scale-95 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 bg-zinc-950/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-zinc-200 p-4 shadow-xl z-50 md:hidden animate-in slide-in-from-top-4 duration-200">
            {/* Search input in mobile menu */}
            <div className="relative mb-4">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products, brands, shops..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
              />
            </div>

             <div className="flex flex-col gap-1.5">
              <Link
                href="/shops"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
              >
                Shops
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/coupons"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
              >
                Coupons
              </Link>
              {user && (
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                >
                  My Orders
                </Link>
              )}

              {/* Dynamic mobile link */}
              {isLoading ? (
                <div className="h-10 w-28 bg-zinc-100 animate-pulse rounded-xl" />
              ) : user ? (
                user.role === "admin" ? (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : user.role === "seller" ? (
                  <Link
                    href="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
                  >
                    Seller Dashboard
                  </Link>
                ) : null
              ) : (
                <Link
                  href="/become-seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-650 hover:bg-indigo-50/50 transition-colors text-left"
                >
                  Become a Seller
                </Link>
              )}

              {/* Authentication actions for guests/users on mobile */}
              {isLoading ? (
                <div className="flex justify-center items-center py-4 mt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs font-semibold text-zinc-500">Checking session...</span>
                  </div>
                </div>
              ) : !user ? (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-100">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 px-4 rounded-full border border-zinc-200 text-zinc-700 hover:text-zinc-950 flex items-center justify-center text-sm font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 px-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center text-sm font-semibold transition-all shadow-sm active:scale-98"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full h-10 px-4 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center text-sm font-semibold transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
    </>
  );
}
