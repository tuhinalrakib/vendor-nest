"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/cards";
import api from "@/lib/api";
import { BarChart, AreaChart } from "@/components/charts";
import Table from "@/components/tables";
import {
  ProductsIcon,
  OrdersIcon,
  CouponsIcon,
  AnalyticsIcon,
  ArrowRightIcon,
} from "@/components/icons";

interface Order {
  id: string;
  customerName: string;
  itemsCount: number;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  date: string;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState("0.00");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payoutConfigured, setPayoutConfigured] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [balanceRes, productsRes, ordersRes] = await Promise.all([
          api.get("/api/payments/payout-settings/"),
          api.get("/api/products/"),
          api.get("/api/orders/")
        ]);
        setBalance(balanceRes.data.balance || "0.00");
        setProducts(productsRes.data || []);
        setOrders(ordersRes.data || []);
        
        const hasPayout = !!(
          balanceRes.data.payoneer_email ||
          balanceRes.data.wise_recipient_name ||
          balanceRes.data.bkash_number
        );
        setPayoutConfigured(hasPayout);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock Sales Data for the chart
  const salesData = [
    { label: "Jan", value: 3400 },
    { label: "Feb", value: 4200 },
    { label: "Mar", value: 3100 },
    { label: "Apr", value: 5800 },
    { label: "May", value: 6200 },
    { label: "Jun", value: 7800 },
    { label: "Jul", value: 8900 },
  ];

  // Mock Recent Orders
  const recentOrders: Order[] = [
    {
      id: "ORD-9482",
      customerName: "Mahmudul Hasan",
      itemsCount: 3,
      totalPrice: 124.5,
      status: "Pending",
      date: "Jun 29, 2026",
    },
    {
      id: "ORD-9481",
      customerName: "Adnan Chowdhury",
      itemsCount: 1,
      totalPrice: 45.0,
      status: "Processing",
      date: "Jun 28, 2026",
    },
    {
      id: "ORD-9480",
      customerName: "Tanzim Rahman",
      itemsCount: 2,
      totalPrice: 89.9,
      status: "Shipped",
      date: "Jun 27, 2026",
    },
    {
      id: "ORD-9479",
      customerName: "Nafisa Kamal",
      itemsCount: 4,
      totalPrice: 320.0,
      status: "Delivered",
      date: "Jun 25, 2026",
    },
  ];

  // Columns for the recent orders table
  const orderColumns = [
    {
      header: "Order ID",
      render: (order: Order) => (
        <span className="font-mono text-zinc-950 font-bold">{order.id}</span>
      ),
    },
    {
      header: "Customer",
      render: (order: Order) => <span>{order.customerName}</span>,
    },
    {
      header: "Items",
      render: (order: Order) => (
        <span className="text-zinc-500 font-semibold">{order.itemsCount} items</span>
      ),
    },
    {
      header: "Total",
      render: (order: Order) => (
        <span className="text-zinc-950 font-extrabold">${order.totalPrice.toFixed(2)}</span>
      ),
    },
    {
      header: "Status",
      render: (order: Order) => {
        const colors = {
          Pending: "bg-amber-50 text-amber-700 border-amber-200",
          Processing: "bg-blue-50 text-blue-700 border-blue-200",
          Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
          Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              colors[order.status]
            }`}
          >
            {order.status}
          </span>
        );
      },
    },
    {
      header: "Date",
      render: (order: Order) => (
        <span className="text-zinc-400 text-xs font-bold">{order.date}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-950 to-zinc-950 p-8 text-white relative overflow-hidden border border-indigo-950 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-lg text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back to VendorNest!
          </h1>
          <p className="text-indigo-200 text-sm font-semibold leading-relaxed">
            Your store is performing outstandingly this week. Check active campaigns and pending fulfillments to keep customer satisfaction high.
          </p>
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => router.push("/seller/add-product")}
              className="px-5 h-10 rounded-xl bg-white hover:bg-zinc-50 text-indigo-950 text-xs font-bold shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              Add New Product
              <ArrowRightIcon className="w-4 h-4 text-indigo-950" />
            </button>
            <button
              onClick={() => router.push("/seller/coupons")}
              className="px-5 h-10 rounded-xl bg-indigo-850 hover:bg-indigo-800 border border-indigo-700/60 text-white text-xs font-bold transition-all duration-200 cursor-pointer"
            >
              Create Coupon
            </button>
          </div>
        </div>

        {/* Dynamic Escrow Wallet Balance */}
        <div className="relative z-10 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-left min-w-50 shrink-0">
          <span className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-widest block">Wallet Balance (Escrow)</span>
          <h2 className="text-2xl font-black mt-1 font-mono text-white">
            ${parseFloat(balance).toFixed(2)}
          </h2>
          <button 
            onClick={() => router.push("/seller/payout-settings")}
            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors mt-3 flex items-center gap-1.5 cursor-pointer"
          >
            Manage Payouts
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Revenue"
          value="$12,450.00"
          change="12.3%"
          isPositive={true}
          icon={<AnalyticsIcon className="w-6 h-6 text-indigo-600" />}
        />
        <StatsCard
          label="Orders Fulfilled"
          value="148"
          change="8.4%"
          isPositive={true}
          icon={<OrdersIcon className="w-6 h-6 text-indigo-600" />}
        />
        <StatsCard
          label="Average Order Value"
          value="$84.12"
          change="2.1%"
          isPositive={false}
          icon={<ProductsIcon className="w-6 h-6 text-indigo-600" />}
        />
        <StatsCard
          label="Active Coupons"
          value="3"
          change="50%"
          isPositive={true}
          icon={<CouponsIcon className="w-6 h-6 text-indigo-600" />}
        />
      </div>

      {/* Analytics Graph & Quick Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Graph */}
        <div className="lg:col-span-2">
          <AreaChart data={salesData} height={220} color="indigo" title="Store Sales Performance ($)" />
        </div>

        {/* Store Action Items */}
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between text-left hover-neon-glow">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-4">Required Actions</h3>
            <div className="space-y-4 max-h-55 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-12 bg-zinc-50 rounded-xl" />
                  <div className="h-12 bg-zinc-50 rounded-xl" />
                </div>
              ) : (!payoutConfigured || products.filter(p => p.stock < 8).length > 0 || orders.filter(o => o.status === "pending" || o.status === "processing").length > 0) ? (
                <>
                  {/* Payout Config Warning */}
                  {!payoutConfigured && (
                    <div 
                      onClick={() => router.push("/seller/payout-settings")}
                      className="flex gap-3.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-150 cursor-pointer hover:bg-indigo-100/50 transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1 shrink-0 animate-bounce" />
                      <div>
                        <h4 className="text-xs font-black text-indigo-700">Setup Payout Configuration</h4>
                        <p className="text-[10px] font-semibold text-zinc-500 mt-0.5 leading-relaxed">
                          Configure your Payoneer, Wise or bKash wallet details to withdraw store earnings.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pending Orders Warning */}
                  {orders.filter(o => o.status === "pending" || o.status === "processing").length > 0 && (
                    <div 
                      onClick={() => router.push("/seller/orders")}
                      className="flex gap-3.5 p-3 rounded-xl bg-blue-50/60 border border-blue-150 cursor-pointer hover:bg-blue-100/50 transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-black text-blue-700">Fulfillment Pending</h4>
                        <p className="text-[10px] font-semibold text-zinc-500 mt-0.5 leading-relaxed">
                          You have {orders.filter(o => o.status === "pending" || o.status === "processing").length} pending client order(s) waiting for packaging and fulfillment.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Out of Stock Alert */}
                  {products.filter(p => p.stock === 0).map((prod) => (
                    <div 
                      key={prod.id} 
                      onClick={() => router.push("/seller/inventory")}
                      className="flex gap-3.5 p-3 rounded-xl bg-red-50/60 border border-red-150 cursor-pointer hover:bg-red-100/50 transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shrink-0 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-black text-red-700">Out of Stock Alert</h4>
                        <p className="text-[10px] font-semibold text-zinc-500 mt-0.5 leading-relaxed">
                          "{prod.name}" has 0 units remaining. Customers cannot order this item.
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Low Stock Alert */}
                  {products.filter(p => p.stock > 0 && p.stock < 8).map((prod) => (
                    <div 
                      key={prod.id} 
                      onClick={() => router.push("/seller/inventory")}
                      className="flex gap-3.5 p-3 rounded-xl bg-amber-50/60 border border-amber-150 cursor-pointer hover:bg-amber-100/50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-amber-700">Low Stock Alert</h4>
                        <p className="text-[10px] font-semibold text-zinc-500 mt-0.5 leading-relaxed">
                          "{prod.name}" is running low with only {prod.stock} units left in inventory.
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <p className="text-[10px] font-bold text-emerald-800">
                    All set! No immediate actions required for your store.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push("/seller/inventory")}
            className="w-full h-11 border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-all duration-200 mt-6 cursor-pointer"
          >
            Review Inventory
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <Table
        data={recentOrders}
        columns={orderColumns}
        title="Recent Client Orders"
        subtitle="Overview of transactions and payments completed over the last 72 hours"
      />
    </div>
  );
}
