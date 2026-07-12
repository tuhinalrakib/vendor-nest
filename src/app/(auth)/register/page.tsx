import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account - VendorNest",
  description: "Sign up as a merchant or buyer on the VendorNest multi-vendor ecommerce marketplace.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
