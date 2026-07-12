"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/forms";
import Button from "@/components/buttons";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, login } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role");
      if (roleParam === "seller" || roleParam === "customer") {
        setRole(roleParam);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // 1. Register User via API
      await register({ name, email, password, confirmPassword, role });
      setIsLoading(false);
      
      Swal.fire({
        title: "Registration Successful!",
        text: `A verification link has been sent to your email (${email}). Please verify your email before logging in.`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      }).then(() => {
        router.push("/login");
      });
    } catch (err: any) {
      setIsLoading(false);
      let msg = "Registration failed. Please check your connection.";
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
            msg = "Registration failed. Please check your inputs.";
          }
        }
      } else {
        msg = String(err);
      }
      setError(msg);
      Swal.fire({
        title: "Registration Failed",
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
          Create a new account
        </h2>
        <p className="text-xs font-medium text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-bold">
            Sign in
          </Link>
        </p>
      </div>

      {/* Role Selection Toggle */}
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
          Customer
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
          Become a Seller
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm Password"
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
            I agree to the{" "}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </Link>.
          </label>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>
    </div>
  );
}
