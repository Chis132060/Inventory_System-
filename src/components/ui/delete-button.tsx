"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  entityName?: string;
}

export function DeleteButton({
  onDelete,
  entityName = "item",
}: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete this ${entityName}?`)) return;

    setLoading(true);
    const result = await onDelete();
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error ?? "Failed to delete");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
      title={`Delete ${entityName}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
