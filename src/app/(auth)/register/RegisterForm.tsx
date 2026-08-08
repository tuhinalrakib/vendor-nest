"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/forms";
import Button from "@/components/buttons";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function RegisterForm() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubdomain, setIsSubdomain] = useState(false);
  const { register, login } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isLocalhostSubdomain = hostname.endsWith(".localhost") && hostname !== "localhost";
      const isProdSubdomain = hostname.split(".").length > 2 && !hostname.startsWith("www.") && !hostname.endsWith(".vercel.app");
      
      const isSub = isLocalhostSubdomain || isProdSubdomain;
      setIsSubdomain(isSub);

      if (isSub) {
        setRole("customer");
      } else {
        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get("role");
        if (roleParam === "seller" || roleParam === "customer") {
          setRole(roleParam);
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError(lang === "bn" ? "অনুগ্রহ করে সকল ঘর পূরণ করুন।" : "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === "bn" ? "পাসওয়ার্ড দুটি মেলেনি।" : "Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // 1. Register User via API
      await register({ name, email, password, confirmPassword, role });
      setIsLoading(false);
      
      Swal.fire({
        title: lang === "bn" ? "রেজিস্ট্রেশন সফল হয়েছে!" : "Registration Successful!",
        text: lang === "bn"
          ? `আপনার ইমেইল ঠিকানা (${email}) এ একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। লগইন করার আগে অনুগ্রহ করে ইমেইল ভেরিফাই করুন।`
          : `A verification link has been sent to your email (${email}). Please verify your email before logging in.`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      }).then(() => {
        router.push("/login");
      });
    } catch (err: any) {
      setIsLoading(false);
      let msg = lang === "bn" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।" : "Registration failed. Please check your connection.";
      if (typeof err === "object" && err !== null) {
        if (err.detail) {
          msg = err.detail;
        } else if (err.non_field_errors) {
          msg = err.non_field_errors[0];
        } else {
          const fieldErrors = Object.entries(err);
          if (fieldErrors.length > 0) {
            const [field, value] = fieldErrors[0];
            msg = `${field}: ${Array.isArray(value) ? value[0] : value}`;
          } else {
            msg = lang === "bn" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে। তথ্যগুলো পুনরায় পরীক্ষা করুন।" : "Registration failed. Please check your inputs.";
          }
        }
      } else {
        msg = String(err);
      }
      setError(msg);
      Swal.fire({
        title: lang === "bn" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" : "Registration Failed",
        text: msg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          {lang === "bn" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create a new account"}
        </h2>
        <p className="text-xs font-medium text-zinc-400">
          {lang === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে? " : "Already have an account? "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-bold">
            {lang === "bn" ? "লগইন করুন" : "Sign in"}
          </Link>
        </p>
      </div>

      {/* Role Selection Toggle */}
      {!isSubdomain && (
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`h-9 rounded-lg text-xs font-bold transition-all ${
              role === "customer"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {lang === "bn" ? "গ্রাহক" : "Customer"}
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`h-9 rounded-lg text-xs font-bold transition-all ${
              role === "seller"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {lang === "bn" ? "বিক্রেতা হিসেবে যোগ দিন" : "Become a Seller"}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">
            {error}
          </div>
        )}

        <Input
          label={lang === "bn" ? "সম্পূর্ণ নাম" : "Full Name"}
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label={lang === "bn" ? "ইমেইল অ্যাড্রেস" : "Email address"}
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label={lang === "bn" ? "পাসওয়ার্ড" : "Password"}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label={lang === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="flex items-start gap-2 pt-1 text-left">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
            required
          />
          <label htmlFor="terms" className="text-xs font-semibold text-zinc-500 leading-normal">
            {lang === "bn" ? (
              <>
                আমি{" "}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                  সেবা নীতিমালার শর্তাবলী
                </Link>{" "}
                এবং{" "}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  গোপনীয়তা নীতি
                </Link>{" "}
                মেনে নিচ্ছি।
              </>
            ) : (
              <>
                I agree to the{" "}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>.
              </>
            )}
          </label>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {lang === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
