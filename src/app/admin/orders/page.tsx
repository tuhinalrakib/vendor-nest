"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Table from "@/components/tables";
import Swal from "sweetalert2";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface OrderItem {
  id: string;
  product: string;
  product_name: string;
  seller_shop: string;
  quantity: number;
  price: string;
}

interface DynamicOrder {
  id: string;
  buyer_name: string;
  total_amount: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<DynamicOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load platform orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      await api.patch(`/api/orders/${orderId}/`, {
        status: newStatus,
      });

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );

      Swal.fire({
        title: "Status Updated",
        text: `Fulfillment status changed to ${newStatus.toUpperCase()} successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Update Failed", "Could not update order status. Please try again.", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    Swal.fire({
      title: "Delete Order?",
      text: "Are you sure you want to permanently delete this order record? This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete Record",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/orders/${orderId}/`);
          
          // Remove from local list
          setOrders((prev) => prev.filter((o) => o.id !== orderId));

          Swal.fire({
            title: "Deleted!",
            text: "Order record has been removed successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Failed to delete order:", err);
          Swal.fire("Deletion Failed", "Could not remove order record. Please try again.", "error");
        }
      }
    });
  };

  const getSellerShops = (items: OrderItem[]): string => {
    if (!items || items.length === 0) return "Platform Store";
    const shops = items.map((item) => item.seller_shop || "Platform Store");
    const uniqueShops = Array.from(new Set(shops));
    return uniqueShops.join(", ");
  };

  const columns = [
    {
      header: "Customer Name",
      render: (order: DynamicOrder) => (
        <span className="text-zinc-800 text-xs font-semibold">
          👤 {order.buyer_name || "Guest Buyer"}
        </span>
      ),
    },
    {
      header: "Seller Shop(s)",
      render: (order: DynamicOrder) => (
        <span className="text-indigo-650 font-bold text-xs truncate max-w-44 block">
          🛒 {getSellerShops(order.items)}
        </span>
      ),
    },
    {
      header: "Payment Method",
      render: (order: DynamicOrder) => (
        <span className="text-zinc-900 font-extrabold text-xs capitalize bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-lg">
          {order.payment_method}
        </span>
      ),
    },
    {
      header: "Total Order Price",
      render: (order: DynamicOrder) => (
        <span className="text-zinc-950 font-black text-xs">
          ${parseFloat(order.total_amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Fulfillment Status",
      render: (order: DynamicOrder) => {
        const colors = {
          pending: "bg-amber-50 text-amber-700 border-amber-200",
          paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
          shipped: "bg-blue-50 text-blue-700 border-blue-200",
          delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
          cancelled: "bg-red-50 text-red-700 border-red-200",
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${colors[order.status] || "bg-zinc-50 border-zinc-200 text-zinc-650"}`}>
            {order.status}
          </span>
        );
      },
    },
    {
      header: "Transaction Date",
      render: (order: DynamicOrder) => (
        <span className="text-zinc-400 text-xs font-bold">
          {new Date(order.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (order: DynamicOrder) => (
        <div className="flex items-center gap-2.5">
          {/* Status selector */}
          <select
            value={order.status}
            disabled={isUpdating === order.id}
            onChange={(e) => handleStatusChange(order.id, e.target.value)}
            className="h-8 px-2 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] font-bold cursor-pointer text-zinc-800 outline-none focus:border-indigo-650"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Delete action */}
          <button
            onClick={() => handleDeleteOrder(order.id)}
            className="h-8 w-8 rounded-lg border border-red-100 hover:border-red-200 hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete Order"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if(isLoading) return <DynamicLoading loadingText="Loading platform transactions..."/>

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Platform Transactions Ledger</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Monitor all cross-vendor sales, update fulfillment status splits, and manage transactions completed on the platform.
        </p>
      </div>

      {/* Orders Table */}
      { orders.length === 0 ? (
        <div className="py-24 text-center bg-white border border-zinc-200 rounded-3xl p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            📑
          </div>
          <h3 className="text-base font-extrabold text-zinc-800">No orders registered</h3>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            No customer orders or transaction logs have been processed on the platform yet.
          </p>
        </div>
      ) : (
        <Table data={orders} columns={columns} />
      )}
    </div>
  );
}
