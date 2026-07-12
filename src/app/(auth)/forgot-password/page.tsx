import type { Metadata } from "next";
import ForgotForm from "./ForgotForm";

export const metadata: Metadata = {
  title: "Forgot Password - VendorNest",
  description: "Request a password reset link for your VendorNest account.",
};

export default function ForgotPasswordPage() {
  return <ForgotForm />;
}
