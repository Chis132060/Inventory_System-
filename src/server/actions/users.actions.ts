"use server";

import { requireAdmin } from "@/lib/auth";
import { roleAssignSchema } from "@/lib/validators";
import { updateUserRole, getAllUsers } from "@/lib/services/users.service";
import { createAuditLog } from "@/lib/services/audit.service";
import type { ActionResult, Profile } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function assignRoleAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const raw = {
    userId: formData.get("userId") as string,
    role: formData.get("role") as string,
  };

  // Validate input
  const parsed = roleAssignSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { userId, role } = parsed.data;

  // Prevent self-assignment
  if (userId === admin.id) {
    return { success: false, error: "You cannot change your own role." };
  }

  try {
    await updateUserRole(userId, role);

    await createAuditLog({
      actorId: admin.id,
      action: "role_change",
      entity: "profiles",
      entityId: userId,
      meta: { new_role: role },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to assign role",
    };
  }
}

export async function fetchUsersAction(): Promise<ActionResult<Profile[]>> {
  await requireAdmin();
  try {
    const users = await getAllUsers();
    return { success: true, data: users };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch users",
    };
  }
}
