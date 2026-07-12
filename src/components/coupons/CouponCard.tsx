import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import api from "@/lib/api";
import Swal from "sweetalert2";

interface CouponCardProps {
  code: string;
  type: "Percentage" | "Fixed Amount" | "percentage" | "fixed";
  value: number;
  minPurchase: number;
  sellerShop: string;
  onClip?: (code: string, clipped: boolean) => void;
  isUsed?: boolean;
}

export default function CouponCard({
  code,
  type,
  value,
  minPurchase,
  sellerShop,
  onClip,
  isUsed = false,
}: CouponCardProps) {
  const { isAuthenticated } = useAuth();
  const [isClipped, setIsClipped] = useState(false);
  const isPercent = type.toLowerCase() === "percentage";

  useEffect(() => {
    const clipped = JSON.parse(localStorage.getItem("clipped_coupons") || "[]");
    if (clipped.includes(code)) {
      setIsClipped(true);
    }
  }, [code]);

  const handleClipToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isUsed) return;

    if (!isAuthenticated) {
      Swal.fire({
        title: "Login Required",
        text: "You must be logged in to save/clip coupons.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#d4d4d8",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    const clipped = JSON.parse(localStorage.getItem("clipped_coupons") || "[]");
    const nextState = !isClipped;

    try {
      if (nextState) {
        await api.post("/api/coupons/save/", { code });
        if (!clipped.includes(code)) {
          clipped.push(code);
        }
      } else {
        await api.delete("/api/coupons/save/", { data: { code } });
        const idx = clipped.indexOf(code);
        if (idx > -1) {
          clipped.splice(idx, 1);
        }
      }

      localStorage.setItem("clipped_coupons", JSON.stringify(clipped));
      setIsClipped(nextState);

      if (onClip) {
        onClip(code, nextState);
      }
      window.dispatchEvent(new Event("clipped_coupons_changed"));
    } catch (err: any) {
      console.error("Failed to update coupon status:", err);
      Swal.fire({
        title: "Action Failed",
        text: err.response?.data?.error || "Could not update the coupon state. Please try again.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };


  return (
    <div className={`border border-dashed p-3.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all duration-300 hover:shadow-xs ${
      isUsed 
        ? "border-zinc-300 bg-zinc-50/60 opacity-75" 
        : "border-emerald-500 bg-emerald-50/40"
    }`}>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
            isUsed 
              ? "text-zinc-500 bg-zinc-200" 
              : "text-emerald-700 bg-emerald-100"
          }`}>
            Coupon
          </span>
          <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">{code}</span>
        </div>
        <h4 className={`text-xs font-black leading-snug ${isUsed ? "text-zinc-500" : "text-emerald-800"}`}>
          Save {isPercent ? `${value}%` : `$${value.toFixed(2)}`}
        </h4>
        <p className="text-[9px] text-zinc-500 leading-relaxed font-semibold">
          {minPurchase > 0 ? `Min purchase of $${minPurchase.toFixed(2)} from ${sellerShop} required` : "No minimum purchase required"}
        </p>
      </div>

      <button
        onClick={handleClipToggle}
        disabled={isUsed}
        className={`h-7 px-3.5 rounded-full text-[10px] font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center shrink-0 ${
          isUsed
            ? "bg-zinc-200 text-zinc-500 cursor-not-allowed border border-transparent font-medium"
            : isClipped
            ? "bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold cursor-pointer"
            : "bg-white border border-emerald-500 hover:bg-emerald-50 text-emerald-700 cursor-pointer"
        }`}
      >
        {isUsed ? "✓ Used" : isClipped ? "✓ Clipped" : "Clip Coupon"}
      </button>
    </div>
  );
}

