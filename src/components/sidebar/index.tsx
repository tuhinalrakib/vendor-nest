import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CloseIcon } from "@/components/icons";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  footer?: React.ReactNode;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  items,
  title = "Dashboard",
  footer,
  isMobileOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-64 lg:h-screen lg:shrink-0 lg:sticky lg:top-0 lg:shadow-none lg:z-auto
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header */}
          <div className="h-16 px-6 border-b border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" iconOnly />
              <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {title}
              </span>
            </div>
            {/* Mobile Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 lg:hidden transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1">
            {items.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  item.isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center ${
                    item.isActive ? "text-white" : "text-zinc-400 dark:text-zinc-550"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        {footer ? (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/40">{footer}</div>
        ) : (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300">
              U
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">User Profile</h4>
              <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500">user@vendornest.com</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
