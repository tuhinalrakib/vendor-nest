"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "./cookies";
import api from "./api";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { authBridge } from "./authBridge";

interface SellerProfile {
  id: string;
  shop_name?: string;
  subdomain?: string;
  support_email?: string;
  shop_description?: string;
  business_license?: string;
  tax_id?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  plan?: "starter" | "growth" | "enterprise";
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "customer" | "seller" | "admin";
  is_superuser?: boolean;
  seller_profile?: SellerProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  googleLogin: (credential: string, role?: string) => Promise<User>;
  refreshUser: () => Promise<void>;
  verifyAdminOtp: (temp_token: string, otp: string) => Promise<User>;
  maintenanceMode: boolean;
  fetchMaintenanceMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const fetchMaintenanceMode = async () => {
    try {
      const response = await api.get("/api/dashboard/settings/");
      setMaintenanceMode(response.data.maintenance_mode || false);
    } catch (e) {
      console.error("Failed to fetch maintenance mode settings:", e);
    }
  };

  useEffect(() => {
    fetchMaintenanceMode();
    const interval = setInterval(fetchMaintenanceMode, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await authBridge();
        setUser(userData);
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    setIsLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      
      if (response.data.otp_required) {
        setIsLoading(false);
        return response.data;
      }
      
      const { access, refresh } = response.data;

      // Save tokens in subdomain-scoped cookies
      setCookie("access_token", access, 7);
      setCookie("refresh_token", refresh, 7);

      // Fetch user profile info using the central api client
      const profileResponse = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/profile/`
      );
      const userData = profileResponse.data;

      setCookie("user", JSON.stringify(userData), 7);
      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error: any) {
      setIsLoading(false);
      throw error.response?.data || { error: "Login failed" };
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.SIGNUP, {
        email: data.email,
        password: data.password,
        password_confirm: data.confirmPassword,
        full_name: data.name,
        role: data.role,
      });
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setIsLoading(false);
      throw error.response?.data || { error: "Registration failed" };
    }
  };

  const googleLogin = async (credential: string, role: string = "customer"): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/google-login/`,
        { credential, role }
      );
      const { access, refresh, user: userData } = response.data;

      // Save tokens in subdomain-scoped cookies
      setCookie("access_token", access, 7);
      setCookie("refresh_token", refresh, 7);

      setCookie("user", JSON.stringify(userData), 7);
      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error: any) {
      setIsLoading(false);
      throw error.response?.data || { error: "Google sign-in failed" };
    }
  };

  const verifyAdminOtp = async (temp_token: string, otp: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/verify-otp/`,
        { temp_token, otp }
      );
      const { access, refresh } = response.data;

      // Save tokens in subdomain-scoped cookies
      setCookie("access_token", access, 7);
      setCookie("refresh_token", refresh, 7);

      // Fetch user profile info using the central api client
      const profileResponse = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/profile/`
      );
      const userData = profileResponse.data;

      setCookie("user", JSON.stringify(userData), 7);
      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error: any) {
      setIsLoading(false);
      throw error.response?.data || { error: "Verification failed" };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = getCookie("refresh_token");
      if (refreshToken) {
        // Send logout request to backend so token gets blacklisted
        await api.post(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/logout/`,
          { refresh: refreshToken }
        );
      }
    } catch (e) {
      console.error("Logout API call failed:", e);
    } finally {
      // Always delete client-side cookies and redirect to home page
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      deleteCookie("user");
      if (typeof window !== "undefined") {
        localStorage.removeItem("clipped_coupons");
        window.dispatchEvent(new Event("clipped_coupons_changed"));
      }
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const syncSavedCoupons = async () => {
      if (user) {
        try {
          const res = await api.get("/api/coupons/saved/");
          const codes = res.data.map((c: any) => c.code);
          localStorage.setItem("clipped_coupons", JSON.stringify(codes));
          window.dispatchEvent(new Event("clipped_coupons_changed"));
        } catch (err) {
          console.error("Failed to sync saved coupons:", err);
        }
      }
    };
    syncSavedCoupons();
  }, [user]);

  const refreshUser = React.useCallback(async () => {
    try {
      const profileResponse = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/profile/`
      );
      const userData = profileResponse.data;
      setCookie("user", JSON.stringify(userData), 7);
      setUser(userData);
    } catch (e) {
      console.error("Failed to refresh user profile:", e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, googleLogin, refreshUser, verifyAdminOtp, maintenanceMode, fetchMaintenanceMode }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
