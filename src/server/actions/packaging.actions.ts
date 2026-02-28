"use server";

import { requireAdmin } from "@/lib/auth";
import { packagingCreateSchema } from "@/lib/validators";
import {
  createPackaging,
  updatePackaging,
  deletePackaging,
} from "@/lib/services/packaging.service";
import { createAuditLog } from "@/lib/services/audit.service";
import type { ActionResult, Packaging } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createPackagingAction(
  formData: FormData,
): Promise<ActionResult<Packaging>> {
  const admin = await requireAdmin();

  const raw = { name: formData.get("name") as string };
  const parsed = packagingCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const pkg = await createPackaging(parsed.data);

    await createAuditLog({
      actorId: admin.id,
      action: "packaging_create",
      entity: "packaging",
      entityId: pkg.id,
      meta: { name: pkg.name },
    });

    revalidatePath("/admin/packaging");
    return { success: true, data: pkg };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create packaging",
    };
  }
}

export async function updatePackagingAction(
  formData: FormData,
): Promise<ActionResult<Packaging>> {
  const admin = await requireAdmin();

  const id = formData.get("id") as string;
  const raw = { name: formData.get("name") as string };
  const parsed = packagingCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const pkg = await updatePackaging(id, parsed.data);

    await createAuditLog({
      actorId: admin.id,
      action: "packaging_update",
      entity: "packaging",
      entityId: pkg.id,
      meta: { name: pkg.name },
    });

    revalidatePath("/admin/packaging");
    return { success: true, data: pkg };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update packaging",
    };
  }
}

export async function deletePackagingAction(
  id: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  try {
    await deletePackaging(id);

    await createAuditLog({
      actorId: admin.id,
      action: "packaging_delete",
      entity: "packaging",
      entityId: id,
    });

    revalidatePath("/admin/packaging");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete packaging",
    };
  }
}
