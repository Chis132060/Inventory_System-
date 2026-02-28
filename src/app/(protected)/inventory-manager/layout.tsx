import { requireRole } from "@/lib/auth";
import { StakeholderSidebar, type NavItem } from "@/components/layout/stakeholder-sidebar";
import { StakeholderTopbar } from "@/components/layout/stakeholder-topbar";

const navItems: NavItem[] = [
  { href: "/inventory-manager/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/inventory-manager/products", label: "Products", icon: "Package" },
  { href: "/inventory-manager/packaging", label: "Packaging", icon: "BoxesIcon" },
  { href: "/inventory-manager/stock-in", label: "Stock In", icon: "ArrowDownToLine" },
  { href: "/inventory-manager/stock-out", label: "Stock Out", icon: "ArrowUpFromLine" },
  { href: "/inventory-manager/activity", label: "Activity", icon: "ClipboardList" },
];

export default async function InventoryManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("INVENTORY_MANAGER", "ADMIN");

  return (
    <div className="flex h-screen bg-gray-50">
      <StakeholderSidebar role="INVENTORY_MANAGER" navItems={navItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StakeholderTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
