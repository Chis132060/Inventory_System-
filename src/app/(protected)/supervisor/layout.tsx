import { requireRole } from "@/lib/auth";
import { StakeholderSidebar, type NavItem } from "@/components/layout/stakeholder-sidebar";
import { StakeholderTopbar } from "@/components/layout/stakeholder-topbar";

const navItems: NavItem[] = [
  { href: "/supervisor/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/supervisor/products", label: "Products", icon: "Package" },
  { href: "/supervisor/team", label: "Team", icon: "Users" },
  { href: "/supervisor/reports", label: "Reports", icon: "BarChart3" },
  { href: "/supervisor/activity", label: "Activity", icon: "ClipboardList" },
];

export default async function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("SUPERVISOR", "ADMIN");

  return (
    <div className="flex h-screen bg-gray-50">
      <StakeholderSidebar role="SUPERVISOR" navItems={navItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StakeholderTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
