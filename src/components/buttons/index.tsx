import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  // Variant classes
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-indigo-500/10 focus:ring-indigo-500",
    secondary: "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 focus:ring-zinc-200",
    outline: "border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 focus:ring-zinc-500",
    ghost: "hover:bg-zinc-100 text-zinc-700 focus:ring-zinc-500",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-sm hover:shadow-red-500/10 focus:ring-red-500",
  };

  // Size classes
  const sizes = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-13 px-7 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left Icon (if not loading) */}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      
      {children}

      {/* Right Icon */}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
