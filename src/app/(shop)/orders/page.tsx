"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface OrderItem {
  id: string;
  product: string;
  product_name?: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  total_amount: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "cod_confirmed";
  created_at: string;
  items: OrderItem[];
  tracking_number?: string;
  courier_name?: string;
  estimated_delivery?: string;
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productMap, setProductMap] = useState<Record<string, string>>({});
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  const fetchOrdersAndProducts = async () => {
    try {
      setIsLoading(true);
      const [orderRes, productRes] = await Promise.all([
        api.get("/api/orders/"),
        api.get("/api/products/"),
      ]);

      const mapping: Record<string, string> = {};
      productRes.data.forEach((p: any) => {
        mapping[p.id] = p.name;
      });
      setProductMap(mapping);
      setOrders(orderRes.data);
    } catch (err) {
      console.error("Failed to load user orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans py-12 px-6 sm:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950">My Purchase History</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">
            Track your orders, payment clearances, and shipment delivery statuses.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-white border border-zinc-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center bg-white border border-zinc-200 rounded-3xl p-8 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-405">
              📦
            </div>
            <h3 className="text-base font-extrabold text-zinc-800">No orders placed yet</h3>
            <p className="text-xs text-zinc-400 font-semibold mt-1">
              Looks like you haven't placed any orders yet. Browse our store to explore items!
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex h-9 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors items-center animate-pulse"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs hover:border-zinc-300 transition-all duration-200"
              >
                {/* Header info */}
                <div className="bg-zinc-50 border-b border-zinc-150 p-5 sm:px-6 flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-zinc-450 uppercase tracking-wider block">Order ID</span>
                    <span className="font-mono text-xs font-black text-zinc-950">
                      {order.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-450 uppercase tracking-wider block">Placed On</span>
                      <span className="text-xs font-bold text-zinc-800">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-450 uppercase tracking-wider block">Total Paid</span>
                      <span className="text-xs font-black text-indigo-700">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-450 uppercase tracking-wider block">Status</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        order.status === "paid" || order.status === "delivered" || order.status === "cod_confirmed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : order.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : order.status === "shipped"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-red-50 text-red-500 border-red-200"
                      }`}>
                        {order.status === "cod_confirmed" ? "COD Confirmed" : order.status}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedTrackingOrder(order)}
                        className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 rounded-lg text-xs font-bold text-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Track Delivery Status"
                      >
                        🚚 Track Order
                      </button>
                      <button
                        onClick={async () => {
                          const { generateInvoicePDF } = await import("@/lib/invoice");
                          const orderWithNames = {
                            ...order,
                            items: order.items.map(item => ({
                              ...item,
                              product_name: productMap[item.product] || "Product"
                            }))
                          };
                          generateInvoicePDF(orderWithNames);
                        }}
                        className="h-8 px-3 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Download Invoice"
                      >
                        <svg className="w-3.5 h-3.5 text-zinc-505" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items in order */}
                <div className="p-5 sm:px-6 divide-y divide-zinc-100">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex justify-between items-center gap-4 text-xs font-bold">
                      <div className="space-y-0.5">
                        <h4 className="text-zinc-850 text-xs font-extrabold">
                          {productMap[item.product] || "General Catalog Product"}
                        </h4>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          Price per unit: ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="text-zinc-500">Qty: {item.quantity}</span>
                        <span className="text-zinc-950 font-extrabold min-w-16 text-right">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Tracking Modal */}
      {selectedTrackingOrder && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedTrackingOrder(null)}
            className="fixed inset-0 bg-black/35 backdrop-blur-xs z-40 transition-opacity"
          />

          {/* Modal Container */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-zinc-950">Track Shipment</h3>
                <span className="text-[10px] font-mono font-bold text-indigo-600 block mt-1">
                  Order #{selectedTrackingOrder.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-450 hover:text-zinc-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
              {/* Step 1: Placed */}
              <div className="relative animate-in slide-in-from-left-3 duration-250">
                <span className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-indigo-650 border-4 border-indigo-100 flex items-center justify-center text-white text-[10px] font-bold">
                  ✓
                </span>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-950">Order Placed</h4>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                    We have successfully received your order application.
                  </p>
                </div>
              </div>

              {/* Step 2: Confirmed / Paid */}
              <div className="relative animate-in slide-in-from-left-3 duration-300">
                <span className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-4 ${
                  ["paid", "cod_confirmed", "shipped", "delivered"].includes(selectedTrackingOrder.status)
                    ? "bg-indigo-650 border-indigo-100 text-white"
                    : "bg-white border-zinc-200 text-zinc-400"
                }`}>
                  {["paid", "cod_confirmed", "shipped", "delivered"].includes(selectedTrackingOrder.status) ? "✓" : "2"}
                </span>
                <div className="text-left">
                  <h4 className={`text-xs font-bold ${
                    ["paid", "cod_confirmed", "shipped", "delivered"].includes(selectedTrackingOrder.status) ? "text-zinc-950" : "text-zinc-400"
                  }`}>
                    {selectedTrackingOrder.status === "cod_confirmed" ? "COD Confirmed" : "Payment Verified & Processing"}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                    {["paid", "cod_confirmed", "shipped", "delivered"].includes(selectedTrackingOrder.status)
                      ? "Your order has been verified and is being prepared for packaging."
                      : "Awaiting payment clearance or confirmation."}
                  </p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="relative animate-in slide-in-from-left-3 duration-350">
                <span className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-4 ${
                  ["shipped", "delivered"].includes(selectedTrackingOrder.status)
                    ? "bg-indigo-650 border-indigo-100 text-white"
                    : "bg-white border-zinc-200 text-zinc-400"
                }`}>
                  {["shipped", "delivered"].includes(selectedTrackingOrder.status) ? "✓" : "3"}
                </span>
                <div className="text-left">
                  <h4 className={`text-xs font-bold ${
                    ["shipped", "delivered"].includes(selectedTrackingOrder.status) ? "text-zinc-950" : "text-zinc-400"
                  }`}>
                    Shipped
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                    {["shipped", "delivered"].includes(selectedTrackingOrder.status)
                      ? "Your package has been dispatched to our courier partner."
                      : "Your package is yet to be picked up by the courier partner."}
                  </p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative animate-in slide-in-from-left-3 duration-400">
                <span className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-4 ${
                  selectedTrackingOrder.status === "delivered"
                    ? "bg-indigo-650 border-indigo-100 text-white"
                    : "bg-white border-zinc-200 text-zinc-400"
                }`}>
                  {selectedTrackingOrder.status === "delivered" ? "✓" : "4"}
                </span>
                <div className="text-left">
                  <h4 className={`text-xs font-bold ${
                    selectedTrackingOrder.status === "delivered" ? "text-zinc-950" : "text-zinc-450"
                  }`}>
                    Delivered
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                    {selectedTrackingOrder.status === "delivered"
                      ? "Order has been successfully handed over to you."
                      : "Awaiting final doorstep delivery."}
                  </p>
                </div>
              </div>
            </div>

            {/* Courier Details Info Box */}
            {["shipped", "delivered"].includes(selectedTrackingOrder.status) && (selectedTrackingOrder.courier_name || selectedTrackingOrder.tracking_number) && (
              <div className="mt-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2 animate-in slide-in-from-top-3 duration-250">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-500">Courier / Partner:</span>
                  <span className="text-zinc-900">{selectedTrackingOrder.courier_name || "N/A"}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-500">Tracking Number:</span>
                  <span className="font-mono text-indigo-650 tracking-wide select-all cursor-pointer" title="Click to copy">
                    {selectedTrackingOrder.tracking_number || "N/A"}
                  </span>
                </div>
                {selectedTrackingOrder.estimated_delivery && (
                  <div className="flex justify-between text-xs font-bold pt-2 border-t border-zinc-200/80">
                    <span className="text-zinc-500">Estimated Delivery:</span>
                    <span className="text-emerald-700">
                      {new Date(selectedTrackingOrder.estimated_delivery).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedTrackingOrder(null)}
              className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl text-xs font-bold transition-all mt-6 cursor-pointer"
            >
              Close Tracker
            </button>
          </div>
        </>
      )}
    </div>
  );
}
