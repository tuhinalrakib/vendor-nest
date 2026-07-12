"use client";

import React, { useState } from "react";
import { Input } from "@/components/forms";
import Button from "@/components/buttons";
import Link from "next/link";

export default function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulating reset password request
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Reset your password
        </h2>
        <p className="text-xs font-medium text-zinc-400">
          Create a new secure password for your account.
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900">Password reset complete</h3>
            <p className="text-xs font-semibold text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>
          </div>
          <Link
            href="/login"
            className="block h-11 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm transition-all"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
