"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Swal from "sweetalert2";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const [countdown, setCountdown] = useState(5);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!uid || !token) {
      setStatus("error");
      setMessage("Invalid verification link. Missing security token or user ID.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.post("/api/users/verify-email/", { uid, token });
        setStatus("success");
        setMessage(response.data.message || "Your email has been verified successfully!");
      } catch (err: any) {
        setStatus("error");
        const errMsg = err.response?.data?.error || "Invalid or expired verification link.";
        setMessage(errMsg);
      }
    };

    verifyEmail();
  }, [uid, token]);

  // Handle auto-redirect on success
  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, router]);

  const handleResendClick = () => {
    Swal.fire({
      title: "Resend Verification Link",
      text: "Enter your registered email address to receive a new verification email:",
      input: "email",
      inputPlaceholder: "Enter your email address",
      showCancelButton: true,
      confirmButtonText: "Send Link",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      showLoaderOnConfirm: true,
      preConfirm: async (email) => {
        try {
          const response = await api.post("/api/users/resend-verification/", { email });
          return response.data;
        } catch (error: any) {
          Swal.showValidationMessage(
            error.response?.data?.error || "Failed to resend email. Please try again."
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Email Sent!",
          text: result.value?.message || "A new verification link has been sent to your email.",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
      }
    });
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white border border-zinc-100 rounded-3xl p-8 shadow-xl shadow-zinc-100/50 space-y-6">
        
        {/* Status Illustration / Spinner */}
        <div className="flex justify-center">
          {status === "loading" && (
            <div className="relative flex items-center justify-center w-16 h-16">
              <div className="absolute w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border border-red-100 text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
            {status === "loading" && "Email Verification"}
            {status === "success" && "Verification Successful!"}
            {status === "error" && "Verification Failed"}
          </h2>
          <p className="text-sm font-medium text-zinc-500 leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Action Button & Countdown */}
        <div className="pt-4">
          {status === "success" && (
            <div className="space-y-4">
              <button
                onClick={() => router.push("/login")}
                className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
              >
                Go to Login
              </button>
              <p className="text-xs font-semibold text-zinc-400">
                Redirecting to login in <span className="text-zinc-600 font-bold">{countdown}</span> seconds...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <button
                onClick={handleResendClick}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => router.push("/register")}
                className="w-full h-11 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Back to Registration
              </button>
            </div>
          )}

          {status === "loading" && (
            <p className="text-xs font-semibold text-zinc-400">
              Please do not close this window.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 rounded-full border-t-indigo-600 animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
