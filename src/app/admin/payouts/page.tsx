"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Table from "@/components/tables";
import Swal from "sweetalert2";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface PayoutRequest {
  id: string;
  seller: string;
  seller_shop: string;
  amount: string;
  payout_method: "payoneer" | "wise";
  status: "pending" | "processing" | "completed" | "failed";
  payout_email_or_account: string;
  reference_id: string | null;
  created_at: string;
}

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPayoutRequests = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/payments/payouts/");
      setPayouts(res.data);
    } catch (err) {
      console.error("Failed to fetch payouts requests for admin:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  const handleDisburse = async (payoutId: string) => {
    const request = payouts.find((p) => p.id === payoutId);
    if (!request) return;

    Swal.fire({
      title: "Disburse Earnings?",
      text: `Confirm transfer of $${parseFloat(request.amount).toFixed(2)} to ${request.seller_shop} via ${request.payout_method.toUpperCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Disburse Now",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setProcessingId(payoutId);
        try {
          const res = await api.post(`/api/payments/payouts/${payoutId}/disburse/`);
          
          // Update status in local state
          setPayouts((prev) =>
            prev.map((p) =>
              p.id === payoutId
                ? { ...p, status: "completed", reference_id: res.data.reference_id }
                : p
            )
          );

          Swal.fire({
            title: "Disbursed Successfully!",
            text: `Funds transferred via ${request.payout_method.toUpperCase()}. Sandbox Reference Transaction ID: ${res.data.reference_id}`,
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error("Failed to execute disburse:", err);
          Swal.fire(
            "Transfer Failed",
            err.response?.data?.error || "Disbursal request failed in the sandbox payment client.",
            "error"
          );
        } finally {
          setProcessingId(null);
        }
      }
    });
  };

  const columns = [
    {
      header: "Request ID",
      render: (log: PayoutRequest) => (
        <span className="font-mono text-[10px] text-zinc-400 font-bold">
          {log.id.substring(0, 8)}...
        </span>
      ),
    },
    {
      header: "Seller Shop",
      render: (log: PayoutRequest) => (
        <span className="text-zinc-900 font-bold text-xs">
          🛒 {log.seller_shop}
        </span>
      ),
    },
    {
      header: "Requested Date",
      render: (log: PayoutRequest) => (
        <span className="text-zinc-550 font-semibold text-xs">
          {new Date(log.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Payout Channel",
      render: (log: PayoutRequest) => (
        <span className="text-zinc-900 font-extrabold capitalize text-xs bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-lg">
          {log.payout_method}
        </span>
      ),
    },
    {
      header: "Destination Details",
      render: (log: PayoutRequest) => (
        <span className="font-mono text-zinc-650 text-xs truncate max-w-44 block">
          {log.payout_email_or_account}
        </span>
      ),
    },
    {
      header: "Payout Amount",
      render: (log: PayoutRequest) => (
        <span className="text-indigo-700 font-black text-xs">
          ${parseFloat(log.amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      render: (log: PayoutRequest) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
          log.status === "completed"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : log.status === "pending"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : log.status === "processing"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-red-50 text-red-500 border-red-200"
        }`}>
          {log.status}
        </span>
      ),
    },
    {
      header: "Reference Key",
      render: (log: PayoutRequest) => (
        <span className="font-mono text-[10px] text-zinc-400 font-semibold">
          {log.reference_id || "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (log: PayoutRequest) => (
        <div>
          {log.status === "pending" ? (
            <button
              onClick={() => handleDisburse(log.id)}
              disabled={processingId === log.id}
              className="h-8 px-4 bg-indigo-650 hover:bg-indigo-700 disabled:bg-zinc-150 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center shadow-xs"
            >
              {processingId === log.id ? "Processing..." : "Disburse Funds"}
            </button>
          ) : (
            <span className="text-[10px] font-bold text-zinc-400">No action needed</span>
          )}
        </div>
      ),
    },
  ];

  if(isLoading) return <DynamicLoading loadingText="platform payout requests..."/>

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Platform Payouts Management</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Review pending vendor withdrawal requests and execute automated disbursals via Wise or Payoneer Sandbox gateways.
        </p>
      </div>

      {/* Main Table Showcase */}
      { payouts.length === 0 ? (
        <div className="py-24 text-center bg-white border border-zinc-200 rounded-3xl p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            💸
          </div>
          <h3 className="text-base font-extrabold text-zinc-800">No payout requests found</h3>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            Sellers haven't requested any balance disbursals yet. Request logs will appear here once submitted.
          </p>
        </div>
      ) : (
        <Table data={payouts} columns={columns} />
      )}
    </div>
  );
}
