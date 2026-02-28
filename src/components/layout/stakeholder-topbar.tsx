import { getProfile } from "@/lib/auth";
import { SignOutButton } from "@/components/layout/sign-out-button";
import type { AppRole } from "@/lib/types";

const roleLabels: Record<string, string> = {
  SUPERVISOR: "Supervisor",
  INVENTORY_MANAGER: "Inventory Manager",
  SALESMAN: "Salesman",
  BUYER: "Buyer",
  ADMIN: "Admin",
  UNASSIGNED: "Unassigned",
};

export async function StakeholderTopbar() {
  const profile = await getProfile();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-700">
          {roleLabels[profile?.role ?? "UNASSIGNED"]} Panel
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {profile?.full_name || profile?.email || "User"}
          </p>
          <p className="text-xs text-gray-500">
            {roleLabels[profile?.role ?? "UNASSIGNED"]}
          </p>
        </div>

        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="h-8 w-8 rounded-full"
          />
        )}

        <SignOutButton />
      </div>
    </header>
  );
}
