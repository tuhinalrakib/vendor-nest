"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/cards";
import { BarChart } from "@/components/charts";
import Table from "@/components/tables";
import Swal from "sweetalert2";
import api from "@/lib/api";
import {
  UsersIcon,
  StoreIcon,
  AnalyticsIcon,
  OrdersIcon,
} from "@/components/icons";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface PendingSeller {
  id: string;
  shop_name: string;
  owner_name: string;
  email: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    total_gmv: number;
    total_customers: number;
    total_sellers: number;
    platform_revenue: number;
    chart_data: { label: string; value: number }[];
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchPendingSellers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/sellers/admin-sellers/");
      // Only show sellers in 'pending' status
      const pending = response.data.filter((s: any) => s.status === "pending");
      setPendingSellers(pending);
    } catch (err: any) {
      console.error("Failed to fetch pending sellers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get("/api/dashboard/admin-stats/");
      setStats(response.data);
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
    fetchStats();
  }, []);

  const handleApprove = (id: string, shopName: string) => {
    Swal.fire({
      title: "Approve Seller?",
      text: `Approved "${shopName || "this shop"}" as an official seller on the platform.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/api/sellers/admin-sellers/${id}/`, { status: "approved" });
          setPendingSellers((prev) => prev.filter((s) => s.id !== id));
          Swal.fire({
            title: "Approved!",
            text: `Approved "${shopName || "this shop"}" successfully.`,
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error("Failed to approve seller:", err);
          Swal.fire({
            title: "Error",
            text: "Could not approve seller account.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };

  const handleReject = (id: string, shopName: string) => {
    Swal.fire({
      title: "Reject Seller?",
      text: `Enter rejection reason for "${shopName || "this shop"}":`,
      input: "text",
      inputPlaceholder: "Reason for rejection...",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reason = result.value || "No reason specified";
        try {
          await api.patch(`/api/sellers/admin-sellers/${id}/`, { 
            status: "rejected",
            rejection_reason: reason
          });
          setPendingSellers((prev) => prev.filter((s) => s.id !== id));
          Swal.fire({
            title: "Rejected!",
            text: `Rejected "${shopName || "this shop"}" (Reason: ${reason}).`,
            icon: "info",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error("Failed to reject seller:", err);
          Swal.fire({
            title: "Error",
            text: "Could not reject seller account.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };

  const sellerColumns = [
    {
      header: "Shop Details",
      render: (seller: PendingSeller) => (
        <div className="flex flex-col text-left">
          <span className="text-zinc-950 font-bold">{seller.shop_name || "Unnamed Shop"}</span>
          <span className="text-[10px] text-zinc-400 font-semibold">{seller.email}</span>
        </div>
      ),
    },
    {
      header: "Owner",
      render: (seller: PendingSeller) => <span>{seller.owner_name || "Unknown Owner"}</span>,
    },
    {
      header: "Applied Date",
      render: (seller: PendingSeller) => (
        <span className="text-zinc-450 text-xs font-bold">
          {seller.created_at ? new Date(seller.created_at).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (seller: PendingSeller) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleApprove(seller.id, seller.shop_name)}
            className="px-3 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold transition-colors cursor-pointer"
          >
            Approve
          </button>
          <button
            onClick={() => handleReject(seller.id, seller.shop_name)}
            className="px-3 h-8 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-[11px] font-extrabold transition-all cursor-pointer"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  // Loading queue...
  if(isLoading) return <DynamicLoading loadingText="Loading queue..."/>

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">Admin Overview Dashboard</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Real-time metrics, growth stats, and onboarding operations across the multi-vendor network.
        </p>
      </div>

      {/* Global SaaS Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Network GMV"
          value={
            statsLoading ? (
              <span className="inline-block w-24 h-7 bg-zinc-150 animate-pulse rounded-md mt-1" />
            ) : (
              `$${(stats?.total_gmv ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )
          }
          icon={<AnalyticsIcon className="w-6 h-6 text-zinc-950" />}
        />
        <StatsCard
          label="Active Platform Customers"
          value={
            statsLoading ? (
              <span className="inline-block w-16 h-7 bg-zinc-150 animate-pulse rounded-md mt-1" />
            ) : (
              (stats?.total_customers ?? 0).toLocaleString()
            )
          }
          icon={<UsersIcon className="w-6 h-6 text-zinc-950" />}
        />
        <StatsCard
          label="Registered Seller Shops"
          value={
            statsLoading ? (
              <span className="inline-block w-16 h-7 bg-zinc-150 animate-pulse rounded-md mt-1" />
            ) : (
              (stats?.total_sellers ?? 0).toLocaleString()
            )
          }
          icon={<StoreIcon className="w-6 h-6 text-zinc-950" />}
        />
        <StatsCard
          label="SaaS Platform Revenue"
          value={
            statsLoading ? (
              <span className="inline-block w-24 h-7 bg-zinc-150 animate-pulse rounded-md mt-1" />
            ) : (
              `$${(stats?.platform_revenue ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )
          }
          icon={<OrdersIcon className="w-6 h-6 text-zinc-950" />}
        />
      </div>

      {/* Charts & Approvals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SaaS Commissions Collected Chart */}
        <div className="lg:col-span-2">
          {statsLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-center items-center h-[310px] w-full">
              <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-zinc-400 mt-2 animate-pulse">Loading revenue data...</p>
            </div>
          ) : (
            <BarChart
              data={stats?.chart_data || []}
              height={220}
              color="indigo"
              title="SaaS Revenue (Commission Fee Collected in $)"
            />
          )}
        </div>

        {/* Pending Approvals quick-list */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 mb-3">Onboarding Queue</h3>
            <p className="text-[10px] font-semibold text-zinc-400 mb-4 leading-relaxed">
              Verify credentials and decide approval status for applicants.
            </p>

            <div className="space-y-3.5">
              { pendingSellers.length > 0 ? (
                pendingSellers.slice(0, 2).map((s) => (
                  <div key={s.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 leading-tight">{s.shop_name || "Unnamed Shop"}</h4>
                      <p className="text-[9px] font-semibold text-zinc-400 truncate max-w-32.5">{s.email}</p>
                    </div>
                    <button
                      onClick={() => handleApprove(s.id, s.shop_name)}
                      className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 text-white rounded-lg text-[9px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      Quick Approve
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs font-semibold text-zinc-400">
                  Onboarding queue is currently empty.
                </div>
              )}
            </div>
          </div>
          {pendingSellers.length > 2 && (
            <div className="text-center pt-4">
              <span 
                onClick={() => router.push("/admin/sellers")}
                className="text-[10px] font-extrabold text-indigo-650 cursor-pointer hover:underline"
              >
                + {pendingSellers.length - 2} more applicants pending
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Seller Onboarding Queue Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-2 bg-white border border-zinc-200 rounded-3xl shadow-xs">
          <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-zinc-400 animate-pulse">Loading queue details...</p>
        </div>
      ) : pendingSellers.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-xs">
          <p className="text-sm font-bold text-zinc-400">No pending seller registrations found.</p>
        </div>
      ) : (
        <Table
          data={pendingSellers}
          columns={sellerColumns}
          title="Pending Seller Applications"
          subtitle="Verification checklist is required for business compliance before activation"
        />
      )}
    </div>
  );
}
