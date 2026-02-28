import { requireRole } from "@/lib/auth";
import { StakeholderSidebar, type NavItem } from "@/components/layout/stakeholder-sidebar";
import { StakeholderTopbar } from "@/components/layout/stakeholder-topbar";

const navItems: NavItem[] = [
  { href: "/salesman/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/salesman/orders", label: "Orders", icon: "ShoppingCart" },
  { href: "/salesman/customers", label: "Customers", icon: "Users" },
  { href: "/salesman/invoices", label: "Invoices", icon: "Receipt" },
  { href: "/salesman/performance", label: "Performance", icon: "TrendingUp" },
];

export default async function SalesmanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("SALESMAN", "ADMIN");

  return (
    <div className="flex h-screen bg-gray-50">
      <StakeholderSidebar role="SALESMAN" navItems={navItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StakeholderTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
