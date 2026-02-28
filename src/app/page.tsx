import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";

export default async function HomePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const roleDashboard: Record<string, string> = {
    ADMIN: "/admin/dashboard",
    SUPERVISOR: "/supervisor/dashboard",
    INVENTORY_MANAGER: "/inventory-manager/dashboard",
    SALESMAN: "/salesman/dashboard",
    BUYER: "/buyer/dashboard",
  };

  redirect(roleDashboard[profile.role] || "/waiting-approval");
}
