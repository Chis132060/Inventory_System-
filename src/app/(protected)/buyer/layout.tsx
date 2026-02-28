import { requireRole } from "@/lib/auth";
import { StakeholderSidebar, type NavItem } from "@/components/layout/stakeholder-sidebar";
import { StakeholderTopbar } from "@/components/layout/stakeholder-topbar";

const navItems: NavItem[] = [
  { href: "/buyer/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/buyer/purchase-orders", label: "Purchase Orders", icon: "ShoppingBag" },
  { href: "/buyer/suppliers", label: "Suppliers", icon: "Truck" },
  { href: "/buyer/receiving", label: "Receiving", icon: "FileText" },
  { href: "/buyer/reports", label: "Reports", icon: "BarChart3" },
];

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("BUYER", "ADMIN");

  return (
    <div className="flex h-screen bg-gray-50">
      <StakeholderSidebar role="BUYER" navItems={navItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StakeholderTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
