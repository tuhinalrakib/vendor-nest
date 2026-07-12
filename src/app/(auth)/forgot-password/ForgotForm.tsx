"use client";

import React, { useState } from "react";
import { Input } from "@/components/forms";
import Button from "@/components/buttons";
import Link from "next/link";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulating forgot password request
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Forgot your password?
        </h2>
        <p className="text-xs font-medium text-zinc-400">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>

      {isSent ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900">Check your email</h3>
            <p className="text-xs font-semibold text-zinc-500 max-w-xs mx-auto leading-relaxed">
              We have sent a password reset link to <strong className="text-zinc-700">{email}</strong>.
            </p>
          </div>
          <Link
            href="/login"
            className="block text-xs font-bold text-indigo-600 hover:text-indigo-500"
          >
            Back to login
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
            label="Email address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Link
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
