"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  BoxesIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShoppingCart,
  Receipt,
  TrendingUp,
  ShoppingBag,
  Truck,
  FileText,
} from "lucide-react";
import type { AppRole } from "@/lib/types";

/* ── Icon registry ─────────────────────────────────────────── */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  BoxesIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShoppingCart,
  Receipt,
  TrendingUp,
  ShoppingBag,
  Truck,
  FileText,
};

export interface NavItem {
  href: string;
  label: string;
  icon: string; // icon name string — resolved via iconMap
}

interface StakeholderSidebarProps {
  role: AppRole;
  navItems: NavItem[];
}

export function StakeholderSidebar({ role, navItems }: StakeholderSidebarProps) {
  const pathname = usePathname();

  const roleLabels: Record<string, string> = {
    SUPERVISOR: "Supervisor",
    INVENTORY_MANAGER: "Inventory Manager",
    SALESMAN: "Salesman",
    BUYER: "Buyer",
    ADMIN: "Admin",
  };

  const roleColors: Record<string, string> = {
    SUPERVISOR: "text-purple-600",
    INVENTORY_MANAGER: "text-teal-600",
    SALESMAN: "text-orange-600",
    BUYER: "text-cyan-600",
    ADMIN: "text-indigo-600",
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/" className="flex items-center gap-2">
          <Package className={`h-7 w-7 ${roleColors[role] || "text-indigo-600"}`} />
          <div>
            <span className="text-lg font-bold text-gray-900">Inventory</span>
            <span className={`ml-1 text-xs font-medium ${roleColors[role] || "text-gray-500"}`}>
              {roleLabels[role] || role}
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = iconMap[item.icon] || Package;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-400">{roleLabels[role]} Panel v0.1</p>
      </div>
    </aside>
  );
}
