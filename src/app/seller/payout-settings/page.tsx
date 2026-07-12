"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Swal from "sweetalert2";
import Table from "@/components/tables";

interface PayoutLog {
  id: string;
  amount: string;
  payout_method: "payoneer" | "wise" | "bkash";
  status: "pending" | "processing" | "completed" | "failed";
  payout_email_or_account: string;
  reference_id: string | null;
  created_at: string;
}

export default function PayoutSettings() {
  const [payoneerEmail, setPayoneerEmail] = useState("");
  const [wiseName, setWiseName] = useState("");
  const [wiseAccount, setWiseAccount] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<"payoneer" | "wise" | "bkash">("payoneer");

  const [payouts, setPayouts] = useState<PayoutLog[]>([]);
  const [balance, setBalance] = useState("0.00");
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchPayoutLogs();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoadingSettings(true);
      const res = await api.get("/api/payments/payout-settings/");
      setPayoneerEmail(res.data.payoneer_email || "");
      setWiseName(res.data.wise_recipient_name || "");
      setWiseAccount(res.data.wise_iban_or_account || "");
      setBkashNumber(res.data.bkash_number || "");
      setBalance(res.data.balance || "0.00");
    } catch (err) {
      console.error("Failed to load payout settings:", err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const fetchPayoutLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const res = await api.get("/api/payments/payouts/");
      setPayouts(res.data);
    } catch (err) {
      console.error("Failed to load payout logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingSettings(true);
    try {
      await api.put("/api/payments/payout-settings/", {
        payoneer_email: payoneerEmail,
        wise_recipient_name: wiseName,
        wise_iban_or_account: wiseAccount,
        bkash_number: bkashNumber,
      });
      Swal.fire({
        title: "Settings Updated",
        text: "Your payout details have been configured successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Update Failed", "Could not save payout settings. Please verify inputs.", "error");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) {
      Swal.fire("Invalid Amount", "Please input a positive request amount.", "warning");
      return;
    }

    const parsedBalance = parseFloat(balance || "0.00");
    if (parsedBalance < 50) {
      Swal.fire("Minimum Balance Required", "You must have at least a $50.00 balance to request a payout.", "warning");
      return;
    }

    setIsRequestingPayout(true);
    try {
      const res = await api.post("/api/payments/payouts/", {
        amount: amount.toFixed(2),
        payout_method: payoutMethod,
      });

      // Append new request to logs list
      setPayouts((prev) => [res.data, ...prev]);
      setPayoutAmount("");
      
      Swal.fire({
        title: "Request Placed",
        text: `Your disbursal request for $${amount.toFixed(2)} is pending review.`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
      fetchSettings(); // Refresh balance from backend
    } catch (err: any) {
      Swal.fire(
        "Request Failed",
        err.response?.data?.error || "Could not place payout request. Verify credentials first.",
        "error"
      );
    } finally {
      setIsRequestingPayout(false);
    }
  };

  const columns = [
    {
      header: "Request ID",
      render: (log: PayoutLog) => (
        <span className="font-mono text-[10px] text-zinc-400 font-bold">
          {log.id.substring(0, 8)}...
        </span>
      ),
    },
    {
      header: "Requested Date",
      render: (log: PayoutLog) => (
        <span className="text-zinc-500 font-semibold text-xs">
          {new Date(log.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Payout Channel",
      render: (log: PayoutLog) => (
        <span className="text-zinc-900 font-bold capitalize text-xs">
          {log.payout_method}
        </span>
      ),
    },
    {
      header: "Destination Account",
      render: (log: PayoutLog) => (
        <span className="font-mono text-zinc-650 text-xs">
          {log.payout_email_or_account}
        </span>
      ),
    },
    {
      header: "Payout Amount",
      render: (log: PayoutLog) => (
        <span className="text-zinc-950 font-black text-xs">
          ${parseFloat(log.amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Verification Status",
      render: (log: PayoutLog) => (
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
      header: "Reference Transaction",
      render: (log: PayoutLog) => (
        <span className="font-mono text-[10px] text-zinc-400 font-semibold">
          {log.reference_id || "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Payout & Disbursals</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Configure Payoneer and Wise credentials to request payouts for your store earnings.
        </p>
      </div>

      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-zinc-950 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-indigo-950/10">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-200 uppercase tracking-widest block">Available Wallet Balance (Escrow)</span>
          <h2 className="text-3xl font-black mt-1.5 font-mono">
            ${parseFloat(balance).toFixed(2)}
          </h2>
          <p className="text-[10px] text-indigo-300/80 font-medium mt-1">
            Funds from online payments (Stripe/Shurjopay) and delivered COD orders are credited here automatically (minus 10% platform fee).
          </p>
        </div>
        <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-indigo-100 uppercase tracking-wide text-center sm:text-right shrink-0">
          Escrow Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Payout Settings Form */}
        <form onSubmit={handleUpdateSettings} className="lg:col-span-7 bg-white border border-zinc-200 p-6 rounded-3xl space-y-4.5 shadow-xs">
          <h2 className="text-sm font-extrabold text-zinc-900 border-b border-zinc-100 pb-2.5">
            🔧 Configure Payout Details
          </h2>

          {isLoadingSettings ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-zinc-50 rounded-xl" />
              <div className="h-10 bg-zinc-50 rounded-xl" />
              <div className="h-10 bg-zinc-50 rounded-xl" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Payoneer Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. merchant@payoneer.com"
                  value={payoneerEmail}
                  onChange={(e) => setPayoneerEmail(e.target.value)}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-xs font-bold outline-none text-zinc-800"
                />
              </div>

              <div className="border-t border-zinc-100 pt-4 space-y-3">
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">Wise Recipients Details</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Wise Account Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={wiseName}
                      onChange={(e) => setWiseName(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-xs font-bold outline-none text-zinc-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Wise Account Number / IBAN</label>
                    <input
                      type="text"
                      placeholder="IBAN or Routing bank account..."
                      value={wiseAccount}
                      onChange={(e) => setWiseAccount(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-xs font-bold outline-none text-zinc-800"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 space-y-3">
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">bKash Account Details</span>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">bKash Personal / Agent Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 017XXXXXXXX"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-xs font-bold outline-none text-zinc-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingSettings}
                className="h-10 px-6 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                {isUpdatingSettings ? "Saving credentials..." : "Save Payout Credentials"}
              </button>
            </div>
          )}
        </form>

        {/* Payout Request Box */}
        <form onSubmit={handleRequestPayout} className="lg:col-span-5 bg-white border border-zinc-200 p-6 rounded-3xl space-y-4 shadow-xs">
          <h2 className="text-sm font-extrabold text-zinc-900 border-b border-zinc-100 pb-2.5">
            💸 Request Payout Disbursal
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-xs font-bold outline-none text-zinc-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Select Payout Channel</label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value as PayoutLog["payout_method"])}
                className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-xs font-bold outline-none cursor-pointer text-zinc-800"
              >
                <option value="payoneer">Payoneer Email</option>
                <option value="wise">Wise Bank Account</option>
                <option value="bkash">bKash Wallet</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isRequestingPayout || isLoadingSettings || parseFloat(balance || "0") < 50}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-colors cursor-pointer flex items-center justify-center disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-200 disabled:shadow-none"
            >
              {isRequestingPayout 
                ? "Submitting Request..." 
                : parseFloat(balance || "0") < 50 
                ? "Minimum $50.00 Balance Required" 
                : "Request Earnings Payout"
              }
            </button>
          </div>
        </form>
      </div>

      {/* Payout History Logs Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-zinc-900 text-left">📜 Payout Request Logs History</h2>
        {isLoadingLogs ? (
          <div className="h-32 bg-white border border-zinc-200 rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-xs text-zinc-400 font-semibold">Loading payout request logs...</span>
          </div>
        ) : (
          <Table data={payouts} columns={columns} />
        )}
      </div>
    </div>
  );
}
