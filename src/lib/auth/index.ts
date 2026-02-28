import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { AppRole, Profile } from "@/lib/types";

/**
 * Get the current authenticated user from Supabase Auth.
 * Returns null if not authenticated.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the profile (including role) of the current user.
 * Returns null if profile doesn't exist.
 */
export async function getProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

/**
 * Get the role of the current user. Returns 'UNASSIGNED' if no profile.
 */
export async function getUserRole(): Promise<AppRole> {
  const profile = await getProfile();
  return profile?.role ?? "UNASSIGNED";
}

/**
 * Server-side role gate. Redirects if the user doesn't have the required role.
 * Use in Server Components and Server Actions.
 */
export async function requireRole(
  ...allowedRoles: AppRole[]
): Promise<Profile> {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!allowedRoles.includes(profile.role)) {
    if (profile.role === "UNASSIGNED") {
      redirect("/waiting-approval");
    }
    redirect("/login");
  }

  return profile;
}

/**
 * Require the user to be an Admin. Convenience wrapper.
 */
export async function requireAdmin(): Promise<Profile> {
  return requireRole("ADMIN");
}
