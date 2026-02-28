import { getProfile } from "@/lib/auth";
import { SignOutButton } from "@/components/layout/sign-out-button";

export async function AdminTopbar() {
  const profile = await getProfile();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-700">Admin Panel</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {profile?.full_name || profile?.email || "Admin"}
          </p>
          <p className="text-xs text-gray-500">{profile?.role}</p>
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
