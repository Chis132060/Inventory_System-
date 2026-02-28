"use server";

import { requireAdmin } from "@/lib/auth";
import { productCreateSchema, productUpdateSchema } from "@/lib/validators";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/products.service";
import { createAuditLog } from "@/lib/services/audit.service";
import type { ActionResult, Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createProductAction(
  formData: FormData,
): Promise<ActionResult<Product>> {
  const admin = await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    packaging_id: (formData.get("packaging_id") as string) || null,
    grams: formData.get("grams") ? Number(formData.get("grams")) : null,
    category: (formData.get("category") as string) || null,
    price: Number(formData.get("price")),
    status: (formData.get("status") as string) || "active",
  };

  const parsed = productCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const product = await createProduct(parsed.data);

    await createAuditLog({
      actorId: admin.id,
      action: "product_create",
      entity: "products",
      entityId: product.id,
      meta: { name: product.name, sku: product.sku },
    });

    revalidatePath("/admin/products");
    return { success: true, data: product };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create product",
    };
  }
}

export async function updateProductAction(
  formData: FormData,
): Promise<ActionResult<Product>> {
  const admin = await requireAdmin();

  const raw = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    packaging_id: (formData.get("packaging_id") as string) || null,
    grams: formData.get("grams") ? Number(formData.get("grams")) : null,
    category: (formData.get("category") as string) || null,
    price: Number(formData.get("price")),
    status: (formData.get("status") as string) || "active",
  };

  const parsed = productUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const product = await updateProduct(parsed.data);

    await createAuditLog({
      actorId: admin.id,
      action: "product_update",
      entity: "products",
      entityId: product.id,
      meta: { name: product.name },
    });

    revalidatePath("/admin/products");
    return { success: true, data: product };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update product",
    };
  }
}

export async function deleteProductAction(
  id: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  try {
    await deleteProduct(id);

    await createAuditLog({
      actorId: admin.id,
      action: "product_delete",
      entity: "products",
      entityId: id,
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete product",
    };
  }
}
