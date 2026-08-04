"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/forms";
import Button from "@/components/buttons";
import { useAuth } from "@/lib/AuthContext";
import Swal from "sweetalert2";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const isAnyLoading = isLoading || isGoogleLoading;
  
  // OTP 2FA States for Admin
  const [otpRequired, setOtpRequired] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const otp = otpValues.join("");
  const [otpError, setOtpError] = useState("");
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login, verifyAdminOtp } = useAuth();

  const handleOtpChange = (index: number, value: string) => {
    const cleanedValue = value.replace(/\D/g, "").slice(-1);
    const newOtpValues = [...otpValues];
    newOtpValues[index] = cleanedValue;
    setOtpValues(newOtpValues);

    // Focus next input if value was entered
    if (cleanedValue !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otpValues[index] === "") {
        if (index > 0) {
          const newOtpValues = [...otpValues];
          newOtpValues[index - 1] = "";
          setOtpValues(newOtpValues);
          otpRefs.current[index - 1]?.focus();
        }
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtpValues = Array(6).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newOtpValues[i] = pastedData[i];
      }
      setOtpValues(newOtpValues);
      
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };
  
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam === "unauthorized_admin") {
      Swal.fire({
        title: "Access Denied",
        text: "You must be an administrator to access that page.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } else if (errorParam === "unauthorized_seller") {
      Swal.fire({
        title: "Access Denied",
        text: "Only registered sellers can access the seller dashboard.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  }, [errorParam]);

  // Handle resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      setIsLoading(false);
      
      // If 2FA OTP is required for Admin
      if (result && result.otp_required) {
        setOtpRequired(true);
        setTempToken(result.temp_token);
        
        // Mask the email address e.g. a***a@gmail.com
        const emailParts = result.email.split("@");
        const namePart = emailParts[0];
        const maskedName = namePart.length > 2 
          ? namePart[0] + "*".repeat(namePart.length - 2) + namePart[namePart.length - 1]
          : namePart;
        setMaskedEmail(`${maskedName}@${emailParts[1]}`);
        setResendCountdown(60); // 60 seconds cooldown for resend
        return;
      }

      Swal.fire({
        title: "Login Successful!",
        text: `Welcome back, ${result.full_name || (result.role === 'admin' ? 'Admin' : (result.role === 'seller' ? 'Seller' : 'User'))}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        if (result.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (result.role === "seller") {
          window.location.href = "/seller/dashboard";
        } else {
          window.location.href = "/";
        }
      });
    } catch (err: any) {
      setIsLoading(false);
      let msg = "Login failed. Please check your network connection.";

      // Handle Axios network connection errors (e.g. ERR_CONNECTION_CLOSED, server offline or spinning up)
      if (err?.code === "ERR_NETWORK" || err?.message === "Network Error" || (err?.isAxiosError && !err.response)) {
        msg = "Unable to connect to the server. If using Render free tier, the backend may be spinning up from sleep. Please wait 15-30 seconds and try again.";
      } else if (typeof err === "object" && err !== null) {
        if (err.detail === "email_not_verified") {
          Swal.fire({
            title: "Email Not Verified",
            text: "Your email address is not verified yet. Would you like to receive a new verification link?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Resend Verification Link",
            confirmButtonColor: "#4f46e5",
            cancelButtonColor: "#6b7280",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
              try {
                const api = (await import("@/lib/api")).default;
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
          return;
        }

        if (err.detail) {
          msg = err.detail;
        } else if (err.non_field_errors) {
          msg = err.non_field_errors[0];
        } else if (err.response?.data?.detail) {
          msg = err.response.data.detail;
        } else if (err.response?.data) {
          const resData = err.response.data;
          const fieldErrors = Object.entries(resData);
          if (fieldErrors.length > 0) {
            const [field, value] = fieldErrors[0];
            msg = `${field}: ${Array.isArray(value) ? value[0] : value}`;
          } else {
            msg = "Invalid credentials. Please try again.";
          }
        } else {
          msg = "Invalid credentials. Please try again.";
        }
      } else {
        msg = String(err);
      }
      setError(msg);
      Swal.fire({
        title: "Authentication Failed",
        text: msg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit verification code.");
      return;
    }
    setOtpError("");
    setIsOtpVerifying(true);
    
    try {
      const result = await verifyAdminOtp(tempToken, otp);
      setIsOtpVerifying(false);
      
      Swal.fire({
        title: "Verification Successful!",
        text: `Welcome back, ${result.full_name || 'Admin'}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/admin/dashboard";
      });
    } catch (err: any) {
      setIsOtpVerifying(false);
      const errMsg = err.error || err.detail || "Verification failed. Please try again.";
      setOtpError(errMsg);
      Swal.fire({
        title: "Verification Failed",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResendingOtp) return;
    setIsResendingOtp(true);
    setOtpError("");
    
    try {
      const api = (await import("@/lib/api")).default;
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/resend-otp/`,
        { temp_token: tempToken }
      );
      
      // Clear OTP input fields and focus first box
      setOtpValues(Array(6).fill(""));
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);

      Swal.fire({
        title: "OTP Resent!",
        text: response.data.message || "A new 2FA code has been sent to your email.",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
      setResendCountdown(60); // 60 seconds countdown
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Failed to resend code. Please try again.";
      setOtpError(errMsg);
    } finally {
      setIsResendingOtp(false);
    }
  };

  if (otpRequired) {
    return (
      <div className="space-y-6">
        {/* Shield verification icon */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-xs mb-3 transition-transform duration-200 hover:scale-105">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900">
            Enter Your OTP
          </h2>
          <p className="text-xs font-semibold text-zinc-500 leading-relaxed max-w-[270px] mx-auto mt-2">
            Enter the 6 digit code that we sent to <span className="text-zinc-800 font-bold">{maskedEmail}</span>.
          </p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-5">
          {otpError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
              {otpError}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider text-left">
              Verification Code
            </label>
            <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 py-1">
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border bg-zinc-50 text-zinc-900 border-zinc-200 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all placeholder-transparent selection:bg-indigo-100"
                  required
                />
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11" 
            isLoading={isOtpVerifying}
            disabled={otp.length !== 6 || isOtpVerifying}
          >
            Verify
          </Button>

          <div className="text-center pt-2 space-y-4">
            <div className="text-xs font-semibold text-zinc-500">
              Didn't receive a code?{" "}
              {resendCountdown > 0 ? (
                <span className="text-indigo-600 font-bold">
                  Resend OTP in {resendCountdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp}
                  className="text-indigo-600 hover:text-indigo-500 font-bold hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isResendingOtp ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => {
                  setOtpRequired(false);
                  setOtpValues(Array(6).fill(""));
                  setOtpError("");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 font-bold transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Sign in to your account
        </h2>
        <p className="text-xs font-medium text-zinc-400">
          Or{" "}
          <Link 
            href="/register" 
            className={`text-indigo-600 hover:text-indigo-500 font-bold ${isAnyLoading ? "pointer-events-none opacity-50" : ""}`}
          >
            create a new account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">
            {error}
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isAnyLoading}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isAnyLoading}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className={`text-xs font-bold text-indigo-600 hover:text-indigo-500 ${isAnyLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            disabled={isAnyLoading}
          />
          <label htmlFor="remember-me" className="text-xs font-semibold text-zinc-500">
            Remember me for 30 days
          </label>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading} disabled={isAnyLoading}>
          Sign In
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <span className="relative px-3 text-xs font-semibold text-zinc-400 bg-white">
          Or continue with
        </span>
      </div>

      <GoogleLoginButton 
        role="customer" 
        onLoadingChange={setIsGoogleLoading} 
        disabled={isAnyLoading} 
      />
    </div>
  );
}
