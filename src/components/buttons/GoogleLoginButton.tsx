"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Swal from "sweetalert2";

// Track Google client initialization state and active login callback globally/module-wide
// to prevent "google.accounts.id.initialize() is called multiple times" warnings.
let isGoogleInitialized = false;
let activeGoogleCallback: ((response: any) => void) | null = null;

interface GoogleLoginButtonProps {
  role?: "customer" | "seller" | "admin";
  onSuccessRedirect?: (role: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
}

export default function GoogleLoginButton({
  role = "customer",
  onSuccessRedirect,
  onLoadingChange,
  disabled = false,
}: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { googleLogin } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    // Otherwise poll for it in case Next Script is loading it asynchronously
    const interval = setInterval(() => {
      if ((window as any).google?.accounts?.id) {
        setScriptLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    const localCallback = async (response: any) => {
      setIsPending(true);
      if (onLoadingChange) onLoadingChange(true);
      try {
        const user = await googleLogin(response.credential, role);
        
        Swal.fire({
          title: "Login Successful!",
          text: `Welcome back, ${user.full_name || (user.role === 'admin' ? 'Admin' : (user.role === 'seller' ? 'Seller' : 'User'))}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          if (onSuccessRedirect) {
            onSuccessRedirect(user.role);
          } else {
            // Redirect based on role
            if (user.role === "admin") {
              window.location.href = "/admin/dashboard";
            } else if (user.role === "seller") {
              window.location.href = "/seller/dashboard";
            } else {
              window.location.href = "/";
            }
          }
        });
      } catch (err: any) {
        console.error("Google Login Backend Error:", err);
        const msg = err.error || err.detail || "Google authentication failed. Please try again.";
        Swal.fire({
          title: "Authentication Failed",
          text: msg,
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
        setIsPending(false);
        if (onLoadingChange) onLoadingChange(false);
      }
    };

    // Update active callback to point to this instance's callback closure
    activeGoogleCallback = localCallback;

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.warn("Google Client ID (NEXT_PUBLIC_GOOGLE_CLIENT_ID) is not defined in the environment variables.");
        return;
      }

      // Initialize the Google Identity client only once
      if (!isGoogleInitialized) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (activeGoogleCallback) {
              activeGoogleCallback(response);
            }
          },
        });
        isGoogleInitialized = true;
      }

      // Measure container width dynamically to ensure responsive fit on mobile
      const containerWidth = containerRef.current.offsetWidth || 300;
      const buttonWidth = Math.min(Math.max(containerWidth, 200), 380);

      // Render the button
      (window as any).google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: buttonWidth,
      });
    } catch (e) {
      console.error("Error rendering Google Login Button:", e);
    }

    return () => {
      // Clean up callback reference when this instance is unmounted
      if (activeGoogleCallback === localCallback) {
        activeGoogleCallback = null;
      }
    };
  }, [scriptLoaded, role, googleLogin, onSuccessRedirect]);

  return (
    <div className="w-full flex justify-center py-1 overflow-hidden">
      <div className="relative w-full max-w-[380px] flex justify-center overflow-hidden">
        {/* Target element for Google button rendering */}
        <div 
          ref={containerRef} 
          className={`w-full min-h-[44px] flex justify-center transition-opacity duration-300 ${
            (isPending || disabled) ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          {!scriptLoaded && (
            <div className="w-full h-[44px] animate-pulse bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-400">
              Loading Google Sign-in...
            </div>
          )}
        </div>

        {/* Loading Spinner Overlay */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl border border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-zinc-700 animate-pulse">Authenticating...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
