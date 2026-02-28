"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Packaging } from "@/lib/types";
import {
  createPackagingAction,
  updatePackagingAction,
} from "@/server/actions/packaging.actions";
import { SubmitButton } from "@/components/ui/submit-button";

interface PackagingFormProps {
  packaging?: Packaging;
}

export function PackagingForm({ packaging }: PackagingFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!packaging;

  async function handleSubmit(formData: FormData) {
    setError(null);
    const action = isEditing ? updatePackagingAction : createPackagingAction;
    const result = await action(formData);

    if (result.success) {
      router.push("/admin/packaging");
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong");
    }
  }

  return (
    <form action={handleSubmit} className="max-w-md space-y-6">
      {isEditing && <input type="hidden" name="id" value={packaging.id} />}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Packaging Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={packaging?.name ?? ""}
          placeholder="e.g. Bottle, Pouch, Box"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>
          {isEditing ? "Update Packaging" : "Create Packaging"}
        </SubmitButton>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
