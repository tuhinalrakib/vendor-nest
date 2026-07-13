"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/tables";
import api from "@/lib/api";
import Swal from "sweetalert2";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";
import { useAuth } from "@/lib/AuthContext";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "cod_confirmed" | "paid" | "shipped" | "delivered" | "cancelled";
  date: string;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
}

export default function SellerOrders() {
  const { maintenanceMode } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<"All" | "pending" | "cod_confirmed" | "paid" | "shipped" | "delivered" | "cancelled">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status & Tracking states for drawer editing
  const [status, setStatus] = useState<string>("");
  const [courierName, setCourierName] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/orders/");
      const mappedOrders: Order[] = res.data.map((o: any) => {
        const items = o.items.map((item: any) => ({
          name: item.product_name || "General Catalog Product",
          quantity: item.quantity,
          price: parseFloat(item.price),
        }));

        const addressParts = [
          o.shipping_address,
          o.shipping_city,
          o.shipping_zip
        ].filter(Boolean);
        const addressStr = addressParts.length > 0 ? addressParts.join(", ") : "No address specified";

        return {
          id: o.id,
          customerName: o.shipping_name || o.buyer_name || "Customer",
          customerEmail: `${o.buyer_name}@vendornest.com`,
          shippingAddress: addressStr,
          items,
          totalPrice: parseFloat(o.total_amount),
          status: o.status,
          date: new Date(o.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          trackingNumber: o.tracking_number,
          courierName: o.courier_name,
          estimatedDelivery: o.estimated_delivery,
        };
      });
      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setStatus(selectedOrder.status);
      setCourierName(selectedOrder.courierName || "");
      setTrackingNumber(selectedOrder.trackingNumber || "");
      setEstimatedDelivery(selectedOrder.estimatedDelivery || "");
    }
  }, [selectedOrder]);

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    if (maintenanceMode) {
      Swal.fire("Maintenance Mode Active", "Cannot update orders during platform maintenance.", "warning");
      return;
    }

    setIsUpdating(true);
    try {
      const payload: any = {
        status,
        tracking_number: status === "shipped" || status === "delivered" ? trackingNumber : null,
        courier_name: status === "shipped" || status === "delivered" ? courierName : null,
        estimated_delivery: status === "shipped" || status === "delivered" ? (estimatedDelivery || null) : null,
      };

      await api.patch(`/api/orders/${selectedOrder.id}/`, payload);
      
      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                status: status as Order["status"],
                trackingNumber: payload.tracking_number || undefined,
                courierName: payload.courier_name || undefined,
                estimatedDelivery: payload.estimated_delivery || undefined,
              }
            : o
        )
      );

      setSelectedOrder(null);
      Swal.fire({
        title: "Order Saved!",
        text: "The order status and shipping tracking info have been updated.",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err: any) {
      console.error("Failed to update status & tracking:", err);
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.detail || "Could not update order status.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) => activeFilter === "All" || o.status === activeFilter
  );

  const columns = [
    {
      header: "Order ID",
      render: (order: Order) => (
        <span className="font-mono text-zinc-950 font-bold block max-w-30 truncate" title={order.id}>
          {order.id}
        </span>
      ),
    },
    {
      header: "Customer",
      render: (order: Order) => (
        <div className="flex flex-col text-left">
          <span className="text-zinc-900 font-bold">{order.customerName}</span>
          <span className="text-[10px] text-zinc-400 font-semibold">{order.customerEmail}</span>
        </div>
      ),
    },
    {
      header: "Products Count",
      render: (order: Order) => {
        const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
        return <span className="text-zinc-500 font-semibold">{totalItems} items</span>;
      },
    },
    {
      header: "Total Price",
      render: (order: Order) => (
        <span className="text-zinc-950 font-extrabold">${order.totalPrice.toFixed(2)}</span>
      ),
    },
    {
      header: "Status",
      render: (order: Order) => {
        const statusColors: Record<Order["status"], string> = {
          pending: "bg-amber-50 text-amber-700 border-amber-200",
          cod_confirmed: "bg-orange-50 text-orange-700 border-orange-200",
          paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
          shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
          delivered: "bg-teal-50 text-teal-700 border-teal-200",
          cancelled: "bg-red-50 text-red-700 border-red-200",
        };
        const statusLabels: Record<Order["status"], string> = {
          pending: "Pending",
          cod_confirmed: "COD Confirmed",
          paid: "Paid",
          shipped: "Shipped",
          delivered: "Delivered",
          cancelled: "Cancelled",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${statusColors[order.status]}`}
          >
            {statusLabels[order.status]}
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
    {
      header: "Actions",
      render: (order: Order) => (
        <button
          onClick={() => setSelectedOrder(order)}
          className="text-xs font-bold text-indigo-650 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          View Details
        </button>
      ),
    },
  ];

  if(isLoading) return <DynamicLoading loadingText="Loading orders..."/>

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Customer Orders</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Monitor payments, verify shipping details, and process fulfillments for client sales.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["All", "pending", "cod_confirmed", "paid", "shipped", "delivered", "cancelled"] as const).map((filter) => {
          const filterLabels: Record<typeof filter, string> = {
            All: "All",
            pending: "Pending",
            cod_confirmed: "COD Confirmed",
            paid: "Paid",
            shipped: "Shipped",
            delivered: "Delivered",
            cancelled: "Cancelled",
          };
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4.5 h-11 rounded-xl text-xs font-bold border whitespace-nowrap cursor-pointer transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {filterLabels[filter]}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      { orders.length === 0 ? (
        <div className="py-24 text-center bg-white border border-zinc-200 rounded-3xl p-8 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-450">
            📦
          </div>
          <h3 className="text-base font-extrabold text-zinc-800">No Orders Found</h3>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            No customer purchases match the selected filter at this time.
          </p>
        </div>
      ) : (
        <Table data={filteredOrders} columns={columns} />
      )}

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/35 backdrop-blur-xs z-40 transition-opacity"
          />

          {/* Side Drawer */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-zinc-200 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-350 ease-out">
            <div className="space-y-6 text-left">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-950">
                    Order Details
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 block mt-1">
                    {selectedOrder.id}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400">
                    Placed on {selectedOrder.date}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-450 hover:text-zinc-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label htmlFor="orderStatus" className="text-xs font-bold text-zinc-600">Update Order Status</label>
                <select
                  id="orderStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="cod_confirmed">COD Confirmed</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Conditional Tracking Inputs */}
              {(status === "shipped" || status === "delivered") && (
                <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    🚚 Shipment & Courier Tracking
                  </h4>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="courierName" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Courier / Delivery Partner</label>
                    <input
                      id="courierName"
                      type="text"
                      placeholder="e.g. RedX, Pathao, FedEx"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="trackingNumber" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tracking ID / Number</label>
                    <input
                      id="trackingNumber"
                      type="text"
                      placeholder="e.g. TRK-892482"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="estimatedDelivery" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Estimated Delivery Date</label>
                    <input
                      id="estimatedDelivery"
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Shipping Information
                </span>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-1">
                  <h4 className="text-xs font-bold text-zinc-900">{selectedOrder.customerName}</h4>
                  <p className="text-xs text-zinc-500 font-semibold">{selectedOrder.customerEmail}</p>
                  <p className="text-xs text-zinc-650 font-bold mt-1.5 leading-relaxed">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Items Details
                </span>
                <div className="divide-y divide-zinc-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-3">
                      <div>
                        <h5 className="text-xs font-bold text-zinc-900">{item.name}</h5>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-zinc-955">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Mode Alert inside Drawer */}
              {maintenanceMode && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-850 rounded-xl text-xs font-bold text-left flex items-start gap-2.5 animate-in fade-in slide-in-from-top-3 duration-250 mb-4">
                  <span className="text-sm shrink-0">⚠️</span>
                  <div>
                    <div className="font-extrabold text-amber-900">Order Updates Disabled</div>
                    <div className="font-semibold text-amber-750 mt-0.5 leading-relaxed">
                      You cannot update shipment status or tracking details during platform maintenance. Write operations are temporarily locked.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Footer */}
            <div className="border-t border-zinc-100 pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-500">Grand Total</span>
                <span className="text-xl font-extrabold text-zinc-950">
                  ${selectedOrder.totalPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 h-11 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTracking}
                  disabled={isUpdating || maintenanceMode}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center transition-all cursor-pointer"
                >
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : maintenanceMode ? (
                    "Locked"
                  ) : (
                    "Save Updates"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
