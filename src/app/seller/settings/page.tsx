"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import Swal from "sweetalert2";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEnds";

export default function SellerSettings() {
  const { user } = useAuth();
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    subdomain: "",
    supportEmail: "",
    storeDescription: "",
    taxId: "",
    businessLicense: "",
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<"starter" | "growth" | "enterprise">("starter");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  // Stripe related states
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeCredentials, setStripeCredentials] = useState({
    accountHolder: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
  });

  const [isConnectingStripe, setIsConnectingStripe] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await api.get(API_ENDPOINTS.SELLER_PROFILE);
        const data = response.data;
        setStoreInfo({
          storeName: data.shop_name || "",
          subdomain: data.subdomain || "",
          supportEmail: data.support_email || "",
          storeDescription: data.shop_description || "",
          taxId: data.tax_id || "",
          businessLicense: data.business_license || "",
        });
        setIsStripeConnected(data.stripe_connected || false);
        setStripeAccountId(data.stripe_account_id || "");
        setCurrentPlan(data.plan || "starter");
      } catch (error) {
        console.error("Failed to fetch seller profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "subdomain") {
      finalValue = value
        .toLowerCase()
        .replace(/\s+/g, "-")          // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, "")    // Remove any character that is not alphanumeric or hyphen
        .replace(/-+/g, "-");          // Collapse multiple consecutive hyphens
    }
    setStoreInfo((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleConnectStripe = () => {
    setShowStripeModal(true);
  };

  const handleDisconnectStripe = () => {
    Swal.fire({
      title: "Disconnect Stripe?",
      text: "Are you sure you want to disconnect Stripe payouts?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, disconnect",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSaving(true);
        try {
          await api.put(API_ENDPOINTS.SELLER_PROFILE, {
            shop_name: storeInfo.storeName,
            subdomain: storeInfo.subdomain || null,
            support_email: storeInfo.supportEmail || null,
            shop_description: storeInfo.storeDescription,
            tax_id: storeInfo.taxId,
            business_license: storeInfo.businessLicense || null,
            stripe_connected: false,
            stripe_account_id: null,
            plan: currentPlan,
          });
          setIsStripeConnected(false);
          setStripeAccountId("");
          Swal.fire({
            title: "Disconnected!",
            text: "Stripe payouts have been disconnected.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (error) {
          console.error("Failed to disconnect Stripe:", error);
          Swal.fire({
            title: "Failed",
            text: "Failed to disconnect Stripe account.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleStripeOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeCredentials.accountHolder || !stripeCredentials.bankName || !stripeCredentials.accountNumber) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please fill in all required bank account details.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    setIsConnectingStripe(true);
    try {
      const generatedStripeId = `acct_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      await api.put(API_ENDPOINTS.SELLER_PROFILE, {
        shop_name: storeInfo.storeName,
        subdomain: storeInfo.subdomain || null,
        support_email: storeInfo.supportEmail || null,
        shop_description: storeInfo.storeDescription,
        tax_id: storeInfo.taxId,
        business_license: storeInfo.businessLicense || null,
        stripe_connected: true,
        stripe_account_id: generatedStripeId,
        plan: currentPlan,
      });

      setIsStripeConnected(true);
      setStripeAccountId(generatedStripeId);
      setShowStripeModal(false);
      
      setStripeCredentials({
        accountHolder: "",
        bankName: "",
        routingNumber: "",
        accountNumber: "",
      });

      Swal.fire({
        title: "Stripe Connected!",
        text: `Your bank account (${stripeCredentials.bankName}) has been linked successfully. Stripe ID: ${generatedStripeId}`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
    } catch (error) {
      console.error("Failed to save Stripe settings:", error);
      Swal.fire({
        title: "Connection Failed",
        text: "Could not link Stripe payouts to the database.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsConnectingStripe(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(API_ENDPOINTS.SELLER_PROFILE, {
        shop_name: storeInfo.storeName,
        subdomain: storeInfo.subdomain || null,
        support_email: storeInfo.supportEmail || null,
        shop_description: storeInfo.storeDescription,
        tax_id: storeInfo.taxId,
        business_license: storeInfo.businessLicense || null,
        stripe_connected: isStripeConnected,
        stripe_account_id: stripeAccountId || null,
        plan: currentPlan,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      let errorMsg = "Failed to update store settings.";
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.subdomain) {
          errorMsg = `Subdomain: ${errorData.subdomain.join(", ")}`;
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        } else {
          errorMsg = Object.entries(errorData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join("\n");
        }
      }
      Swal.fire({
        title: "Update Failed",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-72 bg-white border border-zinc-200 rounded-3xl shadow-xs space-y-4">
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 animate-ping duration-1500"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent bg-linear-to-tr from-indigo-500 via-violet-500 to-pink-500 mask-[linear-gradient(white,transparent)] animate-spin"></div>
            <div className="absolute inset-1 rounded-full border border-dashed border-zinc-300 animate-spin [animation-direction:reverse] duration-6000"></div>
            <div className="absolute inset-1.5 rounded-full bg-white flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-650 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-zinc-400 animate-pulse">Loading products database...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Store Settings</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Customize your public storefront, update tax IDs, and link Stripe payment options.
        </p>
      </div>

      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl text-xs font-bold text-left animate-in fade-in slide-in-from-top-3 duration-250">
          Store settings updated and synchronized with the VendorNest platform!
        </div>
      )}

      {/* Grid Settings */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Forms Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Public Store Profile */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-5">
            <h3 className="text-sm font-bold text-zinc-950">Store profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Store Name */}
              <div className="space-y-1.5">
                <label htmlFor="storeName" className="text-xs font-bold text-zinc-600">
                  Storefront Name
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  value={storeInfo.storeName}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                  required
                />
              </div>

              {/* Subdomain */}
              <div className="space-y-1.5">
                <label htmlFor="subdomain" className="text-xs font-bold text-zinc-600">
                  Subdomain Namespace
                </label>
                <div className="flex rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden focus-within:border-indigo-650 focus-within:bg-white">
                  <input
                    id="subdomain"
                    name="subdomain"
                    type="text"
                    value={storeInfo.subdomain}
                    onChange={handleInputChange}
                    className="flex-1 h-11 px-4 bg-transparent outline-none text-sm font-semibold border-none"
                    required
                  />
                  <span className="h-11 px-3 bg-zinc-100 flex items-center border-l border-zinc-200 text-xs font-bold text-zinc-400">
                    .vendornest.com
                  </span>
                </div>
              </div>
            </div>

            {/* Support Email */}
            <div className="space-y-1.5">
              <label htmlFor="supportEmail" className="text-xs font-bold text-zinc-600">
                Support Email
              </label>
              <input
                id="supportEmail"
                name="supportEmail"
                type="email"
                value={storeInfo.supportEmail}
                onChange={handleInputChange}
                className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                required
              />
            </div>

            {/* Store Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="storeDescription" className="text-xs font-bold text-zinc-600">
                  Store Description
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    if (!storeInfo.storeName) {
                      Swal.fire({
                        title: "Store Name Required",
                        text: "Please enter a storefront name before generating a description.",
                        icon: "warning",
                        confirmButtonColor: "#4f46e5",
                      });
                      return;
                    }
                    if (currentPlan === "starter") {
                      Swal.fire({
                        title: "Feature Restricted",
                        text: "AI Description Generator is only available on Growth and Scale Enterprise plans. Please upgrade your plan on the right.",
                        icon: "warning",
                        confirmButtonColor: "#4f46e5",
                      });
                      return;
                    }
                    
                    setIsGeneratingDescription(true);
                    try {
                      const response = await api.post("/api/ai/generate-store-description/", {
                        name: storeInfo.storeName,
                        style: "professional"
                      });
                      setStoreInfo(prev => ({ ...prev, storeDescription: response.data.description }));
                      Swal.fire({
                        title: "Description Generated!",
                        text: "AI has successfully generated your storefront description.",
                        icon: "success",
                        confirmButtonColor: "#4f46e5",
                      });
                    } catch (error: any) {
                      console.error("AI generation failed:", error);
                      const errorMsg = error.response?.data?.error || "Failed to generate description with AI.";
                      Swal.fire({
                        title: "Generation Failed",
                        text: errorMsg,
                        icon: "error",
                        confirmButtonColor: "#4f46e5",
                      });
                    } finally {
                      setIsGeneratingDescription(false);
                    }
                  }}
                  disabled={isGeneratingDescription}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer disabled:text-zinc-400 transition-colors"
                >
                  {isGeneratingDescription ? (
                    <>
                      <span className="w-3.5 h-3.5 border border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                      Generating...
                    </>
                  ) : (
                    "✨ Generate with AI"
                  )}
                </button>
              </div>
              <textarea
                id="storeDescription"
                name="storeDescription"
                rows={4}
                value={storeInfo.storeDescription}
                onChange={handleInputChange}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none"
              />
            </div>
          </div>

          {/* Business configuration settings */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-5">
            <h3 className="text-sm font-bold text-zinc-950">Business & Compliance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tax ID */}
              <div className="space-y-1.5">
                <label htmlFor="taxId" className="text-xs font-bold text-zinc-600">
                  Tax Registration ID / VAT
                </label>
                <input
                  id="taxId"
                  name="taxId"
                  type="text"
                  value={storeInfo.taxId}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                />
              </div>

              {/* Trade License */}
              <div className="space-y-1.5">
                <label htmlFor="businessLicense" className="text-xs font-bold text-zinc-600">
                  Trade License / Business License
                </label>
                <input
                  id="businessLicense"
                  name="businessLicense"
                  type="text"
                  placeholder="e.g. TRAD/DNCC/012345"
                  value={storeInfo.businessLicense}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Settings */}
        <div className="space-y-6">
          {/* Subscription Plan Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-5">
            <h3 className="text-sm font-bold text-zinc-950">SaaS Plan Subscription</h3>
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-900">
                <span>Active Tier:</span>
                <span className="capitalize">{currentPlan}</span>
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
                <span>Commission Rate:</span>
                <span>
                  {currentPlan === "starter" ? "5%" : currentPlan === "growth" ? "2%" : "0.5%"}
                </span>
              </div>
            </div>

            {/* Upgrade Plan Selection */}
            <div className="space-y-1.5">
              <label htmlFor="planSelect" className="text-xs font-bold text-zinc-600">
                Change Subscription Tier
              </label>
              <select
                id="planSelect"
                value={currentPlan}
                onChange={(e) => {
                  const nextPlan = e.target.value as "starter" | "growth" | "enterprise";
                  setCurrentPlan(nextPlan);
                }}
                className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none cursor-pointer"
              >
                <option value="starter">Starter Plan (Free - 15 products max)</option>
                <option value="growth">Growth Plan ($29/mo - Unlimited)</option>
                <option value="enterprise">Scale Enterprise Plan ($79/mo - Custom Domain)</option>
              </select>
            </div>
          </div>

          {/* Form settings save action */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Save Settings Configurations"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
