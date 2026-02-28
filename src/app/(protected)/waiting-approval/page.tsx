import { signOut } from "@/server/actions/auth.actions";
import { Clock } from "lucide-react";

export default function WaitingApprovalPage() {
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

        <form action={signOut}>
          <button
            type="submit"
            className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Sign out and try again
          </button>
        </form>
      </div>
    </div>
  );
}
