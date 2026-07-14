import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export default function Logo({ className = "", iconOnly = false, size = "md", light = false }: LogoProps) {
  const sizeClasses = {
    sm: {
      box: "w-8 h-8 rounded-lg",
      text: "text-base",
    },
    md: {
      box: "w-9 h-9 rounded-xl",
      text: "text-xl",
    },
    lg: {
      box: "w-12 h-12 rounded-2xl",
      text: "text-2xl",
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const logoIcon = (
    <div
      className={`${currentSize.box} overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 shadow-xs group-hover:scale-105 transition-transform duration-200 relative`}
    >
      <Image
        src="/logo.png"
        alt="VendorNest Brand Logo"
        fill
        sizes="(max-width: 48px) 100vw, 48px"
        priority
        className="object-cover"
      />
    </div>
  );

  if (iconOnly) {
    return logoIcon;
  }

  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {logoIcon}
      <span className={`font-bold tracking-tight ${light ? "text-white" : "text-zinc-955 dark:text-zinc-50"} ${currentSize.text}`}>
        Vendor<span className="text-indigo-600 dark:text-indigo-500">Nest</span>
      </span>
    </Link>
  );
}
