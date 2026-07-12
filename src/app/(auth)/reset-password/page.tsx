import type { Metadata } from "next";
import ResetForm from "./ResetForm";

export const metadata: Metadata = {
  title: "Reset Password - VendorNest",
  description: "Reset the password for your VendorNest account.",
};

export default function ResetPasswordPage() {
  return <ResetForm />;
}
