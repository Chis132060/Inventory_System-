"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/types";
import { Clock, CheckCircle } from "lucide-react";

function getRoleRedirect(role: AppRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "SUPERVISOR":
      return "/supervisor/dashboard";
    case "INVENTORY_MANAGER":
      return "/inventory-manager/dashboard";
    case "SALESMAN":
      return "/salesman/dashboard";
    case "BUYER":
      return "/buyer/dashboard";
    default:
      return "/waiting-approval";
  }
}

export function WaitingRealtimeClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [approved, setApproved] = useState(false);
  const [newRole, setNewRole] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("role-watch")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const updatedRole = payload.new.role as AppRole;
          if (updatedRole && updatedRole !== "UNASSIGNED") {
            setApproved(true);
            setNewRole(updatedRole);
            // Brief delay so user sees the success animation
            setTimeout(() => {
              router.push(getRoleRedirect(updatedRole));
            }, 1500);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  if (approved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              You&apos;ve Been Approved!
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Your role has been set to{" "}
              <span className="font-semibold text-green-700">{newRole}</span>.
              Redirecting you now...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-white">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Waiting for Approval
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Your account has been created, but an administrator needs to assign
            you a role before you can access the system.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please contact your system administrator.
          </p>
        </div>

        {/* Live status indicator */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
          </span>
          <span className="text-xs font-medium text-blue-700">
            Listening for approval — this page will update automatically
          </span>
        </div>

        <form action="/api/auth/signout" method="POST">
          <button
            type="button"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Sign out and try again
          </button>
        </form>
      </div>
    </div>
  );
}
