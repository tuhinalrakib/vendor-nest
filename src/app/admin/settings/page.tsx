"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import api from "@/lib/api";
import Swal from "sweetalert2";

export default function AdminSettings() {
  const { user } = useAuth();
  const isSuperAdmin = !!user?.is_superuser;

  const [platformConfig, setPlatformConfig] = useState({
    platformName: "VendorNest Network",
    supportEmail: "eng.tuhin77@gmail.com",
    starterCommissionRate: "5.0",
    growthCommissionRate: "2.0",
    enterpriseCommissionRate: "0.5",
    signupAllowed: true,
    maintenanceMode: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get("/api/dashboard/settings/");
        setPlatformConfig({
          platformName: response.data.platform_name || "VendorNest Network",
          supportEmail: response.data.support_email || "support@vendornest.com",
          starterCommissionRate: String(response.data.starter_commission_rate ?? "5.0"),
          growthCommissionRate: String(response.data.growth_commission_rate ?? "2.0"),
          enterpriseCommissionRate: String(response.data.enterprise_commission_rate ?? "0.5"),
          signupAllowed: response.data.signup_allowed ?? true,
          maintenanceMode: response.data.maintenance_mode ?? false,
        });
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setPlatformConfig((prev) => ({ ...prev, [name]: val }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      Swal.fire({
        title: "Permission Denied",
        text: "Only Super Administrator accounts are authorized to modify configurations.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/api/dashboard/settings/", {
        platform_name: platformConfig.platformName,
        support_email: platformConfig.supportEmail,
        starter_commission_rate: parseFloat(platformConfig.starterCommissionRate),
        growth_commission_rate: parseFloat(platformConfig.growthCommissionRate),
        enterprise_commission_rate: parseFloat(platformConfig.enterpriseCommissionRate),
        signup_allowed: platformConfig.signupAllowed,
        maintenance_mode: platformConfig.maintenanceMode,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      Swal.fire({
        title: "Error",
        text: "Could not save settings configurations.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Vendor Nest Configuration</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Adjust sitewide commission splits, onboarding parameters, and system operation modes.
        </p>
      </div>

      {/* Permissions warning banner */}
      {!isSuperAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-250 text-amber-850 rounded-2xl text-xs font-bold text-left flex items-start gap-2.5 animate-in fade-in slide-in-from-top-3 duration-250">
          <span className="text-sm">⚠️</span>
          <div>
            <div className="font-extrabold">Read-Only Mode Enabled</div>
            <div className="font-semibold text-amber-700 mt-0.5">
              Only Super Administrator accounts (superuser status = True) are permitted to modify SaaS splits, commission structures, and platform identity settings.
            </div>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl text-xs font-bold text-left animate-in fade-in slide-in-from-top-3 duration-250">
          Global SaaS configuration parameters saved and updated across the multi-vendor network!
        </div>
      )}

      {/* Settings Grid */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* General settings */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-5">
            <h3 className="text-sm font-bold text-zinc-950">Platform Identity</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Platform Name */}
              <div className="space-y-1.5">
                <label htmlFor="platformName" className="text-xs font-bold text-zinc-650">
                  Platform Display Name
                </label>
                <input
                  id="platformName"
                  name="platformName"
                  type="text"
                  disabled={!isSuperAdmin}
                  value={platformConfig.platformName}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Support Email */}
              <div className="space-y-1.5">
                <label htmlFor="supportEmail" className="text-xs font-bold text-zinc-650">
                  Administrative Support Email
                </label>
                <input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  disabled={!isSuperAdmin}
                  value={platformConfig.supportEmail}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>
          </div>

          {/* Commission & Onboarding Parameters */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-5">
            <h3 className="text-sm font-bold text-zinc-950">Financial splits</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Starter Plan */}
              <div className="space-y-1.5">
                <label htmlFor="starterCommissionRate" className="text-xs font-bold text-zinc-650">
                  Starter Plan Commission (%)
                </label>
                <div className="flex rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden focus-within:border-indigo-650 focus-within:bg-white">
                  <input
                    id="starterCommissionRate"
                    name="starterCommissionRate"
                    type="number"
                    step="0.01"
                    disabled={!isSuperAdmin}
                    value={platformConfig.starterCommissionRate}
                    onChange={handleInputChange}
                    className="flex-1 h-11 px-4 bg-transparent outline-none text-sm font-semibold border-none disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                  <span className="h-11 px-3 bg-zinc-100 flex items-center border-l border-zinc-200 text-xs font-bold text-zinc-500">
                    %
                  </span>
                </div>
              </div>

              {/* Growth Plan */}
              <div className="space-y-1.5">
                <label htmlFor="growthCommissionRate" className="text-xs font-bold text-zinc-650">
                  Growth Plan Commission (%)
                </label>
                <div className="flex rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden focus-within:border-indigo-650 focus-within:bg-white">
                  <input
                    id="growthCommissionRate"
                    name="growthCommissionRate"
                    type="number"
                    step="0.01"
                    disabled={!isSuperAdmin}
                    value={platformConfig.growthCommissionRate}
                    onChange={handleInputChange}
                    className="flex-1 h-11 px-4 bg-transparent outline-none text-sm font-semibold border-none disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                  <span className="h-11 px-3 bg-zinc-100 flex items-center border-l border-zinc-200 text-xs font-bold text-zinc-500">
                    %
                  </span>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="space-y-1.5">
                <label htmlFor="enterpriseCommissionRate" className="text-xs font-bold text-zinc-650">
                  Enterprise Plan Commission (%)
                </label>
                <div className="flex rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden focus-within:border-indigo-650 focus-within:bg-white">
                  <input
                    id="enterpriseCommissionRate"
                    name="enterpriseCommissionRate"
                    type="number"
                    step="0.01"
                    disabled={!isSuperAdmin}
                    value={platformConfig.enterpriseCommissionRate}
                    onChange={handleInputChange}
                    className="flex-1 h-11 px-4 bg-transparent outline-none text-sm font-semibold border-none disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                  <span className="h-11 px-3 bg-zinc-100 flex items-center border-l border-zinc-200 text-xs font-bold text-zinc-500">
                    %
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
              These commission percentages will be deducted from purchases based on each merchant's subscription tier. Only Super Admins can customize these rates.
            </p>
          </div>
        </div>

        {/* Right Settings Panel */}
        <div className="space-y-6">
          {/* Operations controls */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-5">
            <h3 className="text-sm font-bold text-zinc-950">Operations & Flags</h3>

            {/* Signup Allowed Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-900">New Seller Signups</h4>
                <p className="text-[9px] text-zinc-450 mt-0.5">Allow public onboarding requests</p>
              </div>
              <input
                type="checkbox"
                name="signupAllowed"
                disabled={!isSuperAdmin}
                checked={platformConfig.signupAllowed}
                onChange={handleInputChange}
                className="w-10 h-5 bg-zinc-100 focus:outline-none rounded-full cursor-pointer accent-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-900">Maintenance Mode</h4>
                <p className="text-[9px] text-zinc-450 mt-0.5">Pause operations across all nodes</p>
              </div>
              <input
                type="checkbox"
                name="maintenanceMode"
                disabled={!isSuperAdmin}
                checked={platformConfig.maintenanceMode}
                onChange={handleInputChange}
                className="w-10 h-5 bg-zinc-100 focus:outline-none rounded-full cursor-pointer accent-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Form settings save action */}
          {isSuperAdmin && (
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Save SaaS Settings Configurations"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
