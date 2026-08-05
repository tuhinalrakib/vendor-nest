"use client";

import React, { useState, useEffect } from "react";
import { BarChart } from "@/components/charts";
import { StatsCard } from "@/components/cards";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";
import api from "@/lib/api";
import { AnalyticsIcon, OrdersIcon, StoreIcon } from "@/components/icons";

interface PayoutRow {
  id: string;
  shop_name: string;
  payout_account: string;
  amount: number;
  status: string;
  date: string;
}

interface ReportsData {
  net_earnings: number;
  pending_payouts: number;
  mrr: number;
  reports_breakdown: { label: string; value: number }[];
  seller_payouts: { label: string; value: number }[];
  payouts_table: PayoutRow[];
}

export default function AdminReports() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ReportsData | null>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/dashboard/admin-reports/");
        setData(response.data);
      } catch (err) {
        console.error("Failed to load admin reports:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportsData();
  }, []);

  if (isLoading || !data) {
    return <DynamicLoading loadingText="Loading platform financial reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Platform Financial Reports</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Review SaaS revenue breakdowns, seller payout schedules, and overall platform volume.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          label="Net Platform Earnings" 
          value={`$${data.net_earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<AnalyticsIcon className="w-6 h-6 text-indigo-600" />}
        />
        <StatsCard 
          label="Pending Seller Payouts" 
          value={`$${data.pending_payouts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<StoreIcon className="w-6 h-6 text-indigo-600" />}
        />
        <StatsCard 
          label="SaaS Subscription MRR" 
          value={`$${data.mrr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<OrdersIcon className="w-6 h-6 text-indigo-600" />}
        />
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings breakdown */}
        <BarChart
          data={data.reports_breakdown}
          height={240}
          color="indigo"
          title="Platform SaaS Revenue Stream Breakdown ($)"
        />

        {/* Top Seller Payouts */}
        <BarChart
          data={data.seller_payouts}
          height={240}
          color="emerald"
          title="Highest Seller Payouts / Balances ($)"
        />
      </div>

      {/* Global SaaS Platform Payout Details table */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left">
        <h3 className="text-sm font-bold text-zinc-950 mb-4">Payout Schedules Overview</h3>
        <div className="overflow-x-auto">
          {data.payouts_table.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-zinc-400">
              No payout requests found in the database.
            </div>
          ) : (
            <table className="w-full min-w-[600px] text-left text-xs font-bold text-zinc-500">
              <thead className="bg-zinc-50 uppercase tracking-wider text-zinc-400 border-b border-zinc-150">
                <tr>
                  <th className="px-6 py-3.5 whitespace-nowrap">Seller Shop</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Destination Account</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Net Payout</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-6 py-3.5 whitespace-nowrap">Release Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {data.payouts_table.map((row) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-50 text-amber-700 border-amber-250",
                    processing: "bg-blue-50 text-blue-700 border-blue-250",
                    completed: "bg-emerald-50 text-emerald-700 border-emerald-250",
                    failed: "bg-red-50 text-red-700 border-red-250",
                  };
                  const statusLabel: Record<string, string> = {
                    pending: "Awaiting Approval",
                    processing: "Processing",
                    completed: "Paid",
                    failed: "Failed",
                  };
                  return (
                    <tr key={row.id} className="text-zinc-700 font-semibold">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-zinc-950">{row.shop_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">{row.payout_account}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-extrabold text-zinc-950">
                        ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${statusColors[row.status] || "bg-zinc-50 text-zinc-700 border-zinc-250"}`}>
                          {statusLabel[row.status] || row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-400">{row.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
