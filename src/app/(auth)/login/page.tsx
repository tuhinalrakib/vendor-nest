import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In - VendorNest",
  description: "Sign in to your VendorNest merchant or buyer account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
