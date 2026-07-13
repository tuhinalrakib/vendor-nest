"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/tables";
import Swal from "sweetalert2";
import api from "@/lib/api";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface PlatformSeller {
  id: string;
  shop_name: string;
  owner_name: string;
  email: string;
  tax_id: string;
  business_license: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  created_at: string;
  shop_description?: string;
  plan?: "starter" | "growth" | "enterprise";
  balance?: string | number;
}

export default function AdminSellers() {
  const [sellers, setSellers] = useState<PlatformSeller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<PlatformSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<PlatformSeller | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | "pending" | "approved" | "suspended" | "rejected">("All");

  const fallbackSellers: PlatformSeller[] = [
    {
      id: "sell-aura",
      shop_name: "AuraLink Official Store",
      owner_name: "Sarah Connor",
      email: "sarah@auralink.io",
      tax_id: "TX-9482948-B",
      business_license: "LIC-8394-AURA",
      status: "approved",
      created_at: "2026-06-25T14:32:00Z",
      shop_description: "High-fidelity smart wireless headphones and premium audiophile gear."
    },
    {
      id: "sell-fashion",
      shop_name: "Zenith Apparel Co.",
      owner_name: "John Doe",
      email: "john@zenith.com",
      tax_id: "TX-1294819-C",
      business_license: "LIC-4819-ZENI",
      status: "pending",
      created_at: "2026-06-29T10:15:00Z",
      shop_description: "Premium quality modern streetwear and waterproof urban apparel."
    },
    {
      id: "sell-deco",
      shop_name: "DecoHaven Essentials",
      owner_name: "Emma Watson",
      email: "emma@decohaven.net",
      tax_id: "TX-7749291-K",
      business_license: "LIC-2940-DECO",
      status: "suspended",
      created_at: "2026-06-20T09:00:00Z",
      shop_description: "Handcrafted home decor, scented soy candles, and lifestyle goods."
    }
  ];

  const fetchSellers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/sellers/admin-sellers/");
      setSellers(response.data);
    } catch (err: any) {
      console.warn("Failed to fetch live sellers, fallback to mocks:", err);
      setSellers(fallbackSellers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Filter sellers by status
  useEffect(() => {
    let result = [...sellers];
    if (statusFilter !== "All") {
      result = result.filter((s) => s.status === statusFilter);
    }
    setFilteredSellers(result);
  }, [statusFilter, sellers]);

  const handleAction = async (id: string, nextStatus: PlatformSeller["status"]) => {
    try {
      await api.patch(`/api/sellers/admin-sellers/${id}/`, { status: nextStatus });
      setSellers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
      );
      setSelectedSeller(null);
      Swal.fire({
        title: "Status Updated!",
        text: `Seller account status is now set to "${nextStatus}".`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err: any) {
      console.error("Failed to update status:", err);
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.detail || "Could not update seller status.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const columns = [
    {
      header: "Store Shop",
      render: (s: PlatformSeller) => (
        <div className="flex flex-col text-left max-w-xs">
          <span className="text-zinc-950 font-bold">{s.shop_name || "Unnamed Shop"}</span>
          <span className="text-[10px] text-zinc-450 line-clamp-2 mt-0.5 leading-relaxed font-semibold">
            {s.shop_description || "No shop description provided."}
          </span>
        </div>
      ),
    },
    {
      header: "Owner Contact",
      render: (s: PlatformSeller) => (
        <div className="flex flex-col text-left">
          <span className="text-zinc-900 font-bold">{s.owner_name || "Unknown Owner"}</span>
          <span className="text-[10px] text-zinc-450 font-semibold">{s.email}</span>
        </div>
      ),
    },
    {
      header: "Business IDs",
      render: (s: PlatformSeller) => (
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-zinc-550">Tax: {s.tax_id || "Not Provided"}</span>
          <span className="text-[10px] font-semibold text-zinc-400">Lic: {s.business_license || "Not Provided"}</span>
        </div>
      ),
    },
    {
      header: "SaaS Plan",
      render: (s: PlatformSeller) => (
        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-200 capitalize">
          {s.plan || "starter"}
        </span>
      ),
    },
    {
      header: "Owed Balance (Wallet)",
      render: (s: PlatformSeller) => (
        <span className="text-indigo-700 font-extrabold text-xs">
          ${parseFloat(String(s.balance || "0")).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Verification Status",
      render: (s: PlatformSeller) => {
        const colors = {
          approved: "bg-emerald-50 text-emerald-700 border-emerald-250",
          pending: "bg-amber-50 text-amber-700 border-amber-250",
          rejected: "bg-rose-50 text-rose-700 border-rose-250",
          suspended: "bg-red-50 text-red-700 border-red-250",
        };
        const labels = {
          approved: "Approved",
          pending: "Pending Verification",
          rejected: "Rejected",
          suspended: "Suspended",
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${colors[s.status] || "bg-zinc-50 text-zinc-700 border-zinc-250"}`}>
            {labels[s.status] || s.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (s: PlatformSeller) => (
        <button
          onClick={() => setSelectedSeller(s)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-750 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Review Verification
        </button>
      ),
    },
  ];

  if(isLoading) return <DynamicLoading loadingText="Loading Sellers data..."/>

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Store Sellers Onboarding</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Perform strict audits on store business licenses, tax listings, and approve/restrict stores.
        </p>
      </div>

      {/* Filtering Actions */}
      <div className="flex flex-wrap gap-2 items-center p-4 bg-white border border-zinc-200 rounded-2xl select-none">
        <span className="text-xs font-extrabold text-zinc-550 mr-2">Filter Status:</span>
        {(["All", "pending", "approved", "suspended", "rejected"] as const).map((filter) => {
          const labels = {
            All: "All Stores",
            pending: "Pending Verification",
            approved: "Approved Stores",
            suspended: "Suspended",
            rejected: "Rejected"
          };
          return (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 h-9 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer capitalize ${
                statusFilter === filter
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {labels[filter]}
            </button>
          );
        })}
      </div>

      {/* Sellers List Table */}
      { filteredSellers.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-xs">
          <p className="text-sm font-bold text-zinc-400">No sellers matching the status filter.</p>
        </div>
      ) : (
        <Table data={filteredSellers} columns={columns} />
      )}

      {/* Verification modal dialog */}
      {selectedSeller && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedSeller(null)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-45 transition-opacity cursor-pointer"
          />

          {/* Dialog Panel */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-zinc-950 text-left">
                Review Application: {selectedSeller.shop_name || "Unnamed Shop"}
              </h3>
              <button
                onClick={() => setSelectedSeller(null)}
                className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Document details */}
            <div className="space-y-4 text-left">
              <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-500">
                  <span>Legal Owner:</span>
                  <span className="text-zinc-900">{selectedSeller.owner_name || "N/A"}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-500">
                  <span>Contact Email:</span>
                  <span className="text-zinc-900">{selectedSeller.email}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-500">
                  <span>Tax ID/TIN:</span>
                  <span className="text-zinc-900 font-mono">{selectedSeller.tax_id || "Not Provided"}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-500">
                  <span>Trade License:</span>
                  <span className="text-zinc-900 font-mono">{selectedSeller.business_license || "Not Provided"}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-550">
                  <span>Applied On:</span>
                  <span className="text-zinc-900">
                    {selectedSeller.created_at ? new Date(selectedSeller.created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-550 pt-1.5 border-t border-zinc-100 mt-1.5">
                  <span>Owed Wallet Balance:</span>
                  <span className="text-indigo-700 font-black">
                    ${parseFloat(String(selectedSeller.balance || "0")).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-550 pt-1.5 border-t border-zinc-100 mt-1.5">
                  <span>SaaS Subscription:</span>
                  <select
                    value={selectedSeller.plan || "starter"}
                    onChange={async (e) => {
                      const nextPlan = e.target.value as "starter" | "growth" | "enterprise";
                      try {
                        await api.patch(`/api/sellers/admin-sellers/${selectedSeller.id}/`, { plan: nextPlan });
                        setSellers((prev) =>
                          prev.map((s) => (s.id === selectedSeller.id ? { ...s, plan: nextPlan } : s))
                        );
                        setSelectedSeller((prev) => prev ? { ...prev, plan: nextPlan } : null);
                        Swal.fire({
                          title: "Plan Updated!",
                          text: `Seller plan updated to ${nextPlan}.`,
                          icon: "success",
                          confirmButtonColor: "#4f46e5",
                        });
                      } catch (err: any) {
                        console.error("Failed to update plan:", err);
                        Swal.fire({
                          title: "Update Failed",
                          text: err.response?.data?.detail || "Could not update seller plan.",
                          icon: "error",
                          confirmButtonColor: "#4f46e5",
                        });
                      }
                    }}
                    className="bg-white border border-zinc-200 text-zinc-800 rounded-lg p-1.5 font-bold focus:outline-none"
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] font-semibold text-indigo-700 leading-relaxed">
                Ensure compliance before marking this seller as approved. Once approved, they will receive a notification and their store subdomain will be activated instantly.
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => handleAction(selectedSeller.id, "suspended")}
                  className="h-11 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(selectedSeller.id, "approved")}
                  className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSeller(null)}
                  className="h-11 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

