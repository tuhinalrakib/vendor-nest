import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

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
}

export default function Sidebar({ items, title = "Dashboard", footer }: SidebarProps) {
  return (
    <aside className="w-64 h-screen border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md flex flex-col justify-between shrink-0 sticky top-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <div className="h-16 px-6 border-b border-zinc-100 dark:border-zinc-800/40 flex items-center gap-2.5">
          <Logo size="sm" iconOnly />
          <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </span>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-semibold transition-all duration-205 ${
                item.isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-100"
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center ${item.isActive ? "text-white" : "text-zinc-400 dark:text-zinc-550"}`}>
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
  );
}
