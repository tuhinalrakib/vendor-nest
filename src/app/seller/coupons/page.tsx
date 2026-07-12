"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/tables";
import { AddIcon, TrashIcon } from "@/components/icons";
import Swal from "sweetalert2";
import api from "@/lib/api";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface Coupon {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
}

export default function SellerCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "Percentage" as Coupon["type"],
    value: "",
    minPurchase: "",
    expiryDate: "",
  });

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/coupons/");
      const mapped = res.data.map((c: any) => ({
        id: c.id,
        code: c.code,
        type: c.discount_type === "percentage" ? "Percentage" : "Fixed Amount",
        value: parseFloat(c.discount_value),
        minPurchase: parseFloat(c.min_purchase),
        expiryDate: c.expiry_date,
        isActive: c.is_active,
      }));
      setCoupons(mapped);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleActive = async (couponId: string) => {
    const coupon = coupons.find((c) => c.id === couponId);
    if (!coupon) return;

    try {
      await api.patch(`/api/coupons/${couponId}/`, {
        is_active: !coupon.isActive,
      });
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err) {
      Swal.fire("Error", "Failed to update coupon status.", "error");
    }
  };

  const handleDelete = (couponId: string) => {
    Swal.fire({
      title: "Delete Coupon?",
      text: "Are you sure you want to delete this coupon code?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/coupons/${couponId}/`);
          setCoupons((prev) => prev.filter((c) => c.id !== couponId));
          Swal.fire({
            title: "Deleted!",
            text: "Coupon has been deleted.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err) {
          Swal.fire("Error", "Failed to delete coupon.", "error");
        }
      }
    });
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value || !newCoupon.expiryDate) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      const res = await api.post("/api/coupons/", {
        code: newCoupon.code.toUpperCase().replace(/\s+/g, ""),
        discount_type: newCoupon.type === "Percentage" ? "percentage" : "fixed",
        discount_value: parseFloat(newCoupon.value) || 0,
        min_purchase: parseFloat(newCoupon.minPurchase) || 0,
        expiry_date: newCoupon.expiryDate,
        is_active: true,
      });

      const created: Coupon = {
        id: res.data.id,
        code: res.data.code,
        type: res.data.discount_type === "percentage" ? "Percentage" : "Fixed Amount",
        value: parseFloat(res.data.discount_value),
        minPurchase: parseFloat(res.data.min_purchase),
        expiryDate: res.data.expiry_date,
        isActive: res.data.is_active,
      };

      setCoupons((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewCoupon({
        code: "",
        type: "Percentage",
        value: "",
        minPurchase: "",
        expiryDate: "",
      });

      Swal.fire({
        title: "Created!",
        text: "Coupon created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Creation Failed",
        text: "Failed to create coupon. Make sure the code is unique.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const columns = [
    {
      header: "Coupon Code",
      render: (coupon: Coupon) => (
        <span className="font-mono text-zinc-950 font-extrabold uppercase tracking-wide bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-xl">
          {coupon.code}
        </span>
      ),
    },
    {
      header: "Discount Details",
      render: (coupon: Coupon) => (
        <span className="text-zinc-900 font-bold">
          {coupon.type === "Percentage" ? `${coupon.value}% Off` : `$${coupon.value.toFixed(2)} Off`}
        </span>
      ),
    },
    {
      header: "Min Purchase Threshold",
      render: (coupon: Coupon) => (
        <span className="text-zinc-550 font-semibold">
          {coupon.minPurchase > 0 ? `$${coupon.minPurchase.toFixed(2)}` : "No limit"}
        </span>
      ),
    },
    {
      header: "Expires On",
      render: (coupon: Coupon) => (
        <span className="text-zinc-400 text-xs font-bold">{coupon.expiryDate}</span>
      ),
    },
    {
      header: "Status Toggle",
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleActive(coupon.id)}
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer ${
              coupon.isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-zinc-100 text-zinc-500 border border-zinc-200"
            }`}
          >
            {coupon.isActive ? "Active" : "Disabled"}
          </button>
        </div>
      ),
    },
    {
      header: "Actions",
      render: (coupon: Coupon) => (
        <button
          onClick={() => handleDelete(coupon.id)}
          className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          <TrashIcon className="w-4.5 h-4.5" />
        </button>
      ),
    },
  ];

  if(isLoading && coupons.length === 0) {
    return <DynamicLoading loadingText="Loading coupons list..."/>
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Store Coupons</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">
            Configure discounts, percentage codes, and fixed value offers for checkout.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <AddIcon className="w-4.5 h-4.5" />
          Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <Table data={coupons} columns={columns} />

      {/* Create Coupon Modal */}
      {showAddModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-45 transition-opacity"
          />

          {/* Dialog Panel */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-zinc-950 text-left">Create Store Coupon</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-left">
              {/* Code */}
              <div className="space-y-1.5">
                <label htmlFor="code" className="text-xs font-bold text-zinc-650">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="code"
                  type="text"
                  placeholder="e.g. FLASH30"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon((prev) => ({ ...prev, code: e.target.value }))}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label htmlFor="type" className="text-xs font-bold text-zinc-650">
                  Discount Type
                </label>
                <select
                  id="type"
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon((prev) => ({ ...prev, type: e.target.value as Coupon["type"] }))}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed Amount">Fixed Amount ($)</option>
                </select>
              </div>

              {/* Value & Min Purchase */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="value" className="text-xs font-bold text-zinc-650">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="value"
                    type="number"
                    placeholder={newCoupon.type === "Percentage" ? "15" : "10.00"}
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="minPurchase" className="text-xs font-bold text-zinc-650">
                    Min Purchase ($)
                  </label>
                  <input
                    id="minPurchase"
                    type="number"
                    placeholder="0.00"
                    value={newCoupon.minPurchase}
                    onChange={(e) => setNewCoupon((prev) => ({ ...prev, minPurchase: e.target.value }))}
                    className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-1.5">
                <label htmlFor="expiryDate" className="text-xs font-bold text-zinc-650">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={(e) => setNewCoupon((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-11 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 transition-colors cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
