"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Sidebar from "@/components/sidebar";
import Loading from "@/app/loading";
import api from "@/lib/api";
import {
  DashboardIcon,
  UsersIcon,
  ProductsIcon,
  FolderIcon,
  CouponsIcon,
  OrdersIcon,
  ReportsIcon,
  SettingsIcon,
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  StoreIcon,
} from "@/components/icons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkRead = async (id: string, type: string) => {
    try {
      await api.post(`/api/notifications/${id}/mark-read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      
      // Redirect based on type
      if (type === "seller_application") {
        router.push("/admin/sellers");
      } else if (type === "payout_request") {
        router.push("/admin/payouts");
      }
      setShowNotifications(false);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post("/api/notifications/mark-all-read/");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

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

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "admin") {
        router.push("/"); // Redirect normal users/sellers to home
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Admin Navigation Sidebar Configuration
  const sidebarItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <DashboardIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/dashboard",
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <UsersIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/users",
    },
    {
      label: "Sellers",
      href: "/admin/sellers",
      icon: <StoreIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/sellers",
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: <ProductsIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/products",
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: <FolderIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/categories",
    },
    {
      label: "Coupons",
      href: "/admin/coupons",
      icon: <CouponsIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/coupons",
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: <OrdersIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/orders",
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: <ReportsIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/reports",
    },
    {
      label: "Payouts",
      href: "/admin/payouts",
      icon: <span className="w-5 h-5 flex items-center justify-center text-zinc-500 font-bold">💸</span>,
      isActive: pathname === "/admin/payouts",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      isActive: pathname === "/admin/settings",
    },
  ];

  // Footer inside sidebar for the admin portal
  const sidebarFooter = (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 p-2 bg-red-50/50 rounded-xl border border-red-100">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider">
          Security Mode: High
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-extrabold text-sm border border-zinc-800 shadow-sm">
          {getInitials()}
        </div>
        <div className="text-left flex-1 min-w-0">
          <h4 className="text-xs font-bold text-zinc-900 truncate">{user.full_name || "Administrator"}</h4>
          <p className="text-[10px] font-semibold text-zinc-400 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );

  const getPageTitle = () => {
    const activeItem = sidebarItems.find((item) => item.isActive);
    return activeItem ? activeItem.label : "Admin Portal";
  };

  return (
    <div className="flex min-h-screen bg-zinc-50/60 font-sans">
      {/* Sidebar Panel */}
      <Sidebar items={sidebarItems} title="VendorNest Admin" footer={sidebarFooter} />

      {/* Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 px-8 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-500 tracking-wide uppercase">Admin Console</span>
            <span className="text-xs font-extrabold text-zinc-300">/</span>
            <span className="text-sm font-bold text-zinc-900">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification Indicator */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-zinc-500 hover:text-zinc-950 rounded-xl hover:bg-zinc-100 transition-all duration-200 relative cursor-pointer active:scale-95 flex items-center justify-center"
              >
                <BellIcon className="w-5 h-5" />
                {notifications.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white font-extrabold text-[8px] flex items-center justify-center border border-white shadow-xs z-10">
                    {notifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right text-left">
                    <div className="flex items-center justify-between px-2 pb-2.5 border-b border-zinc-100 mb-2">
                      <span className="text-xs font-extrabold text-zinc-955">Notifications</span>
                      {notifications.filter((n) => !n.is_read).length > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-extrabold text-indigo-650 hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-1.5 pr-0.5">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleMarkRead(n.id, n.notification_type)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                              n.is_read
                                ? "bg-white border-zinc-100 hover:bg-zinc-50"
                                : "bg-indigo-50/20 border-indigo-100 hover:bg-indigo-50/40"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className={`text-[11px] font-bold ${n.is_read ? "text-zinc-800" : "text-indigo-950"}`}>
                                {n.title}
                              </h4>
                              {!n.is_read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-500 font-semibold line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[8px] font-bold text-zinc-400 mt-1 block">
                              {new Date(n.created_at).toLocaleString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs font-semibold text-zinc-400">
                          No notifications found.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <span className="h-5 w-[1px] bg-zinc-200"></span>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-zinc-50 transition-all duration-200 text-left cursor-pointer"
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

              {showProfileMenu && (
                <>
                  <div
                    onClick={() => setShowProfileMenu(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-zinc-100 mb-1">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Logged in as</span>
                      <span className="block text-xs font-bold text-red-600 capitalize">{user.role}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push("/admin/settings");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4 text-zinc-400" />
                      Platform Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors mt-1"
                    >
                      <LogOutIcon className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Workspace details */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
