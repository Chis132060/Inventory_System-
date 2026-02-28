"use client";

import { useState } from "react";
import { APP_ROLES, type AppRole, type Profile } from "@/lib/types";
import { assignRoleAction } from "@/server/actions/users.actions";

interface RoleAssignFormProps {
  user: Profile;
  currentAdminId: string;
}

export function RoleAssignForm({ user, currentAdminId }: RoleAssignFormProps) {
  const [selectedRole, setSelectedRole] = useState<AppRole>(user.role);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSelf = user.id === currentAdminId;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await assignRoleAction(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(result.error ?? "Unknown error");
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={user.id} />
      <select
        name="role"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value as AppRole)}
        disabled={isSelf || loading}
        className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {APP_ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={isSelf || loading || selectedRole === user.role}
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Saving..." : "Assign"}
      </button>

      {isSelf && (
        <span className="text-xs text-amber-600">Cannot change own role</span>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
      {success && <span className="text-xs text-green-600">Updated!</span>}
    </form>
  );
}
