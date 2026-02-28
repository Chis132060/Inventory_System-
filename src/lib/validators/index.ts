import { z } from "zod";
import { APP_ROLES } from "@/lib/types";

// ── Product schemas ──────────────────────────────────────────

export const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Name too long"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(100, "SKU too long")
    .regex(/^[A-Za-z0-9-_]+$/, "SKU can only contain letters, numbers, hyphens, underscores"),
  packaging_id: z.string().uuid("Invalid packaging").nullable().optional(),
  grams: z.coerce
    .number()
    .min(0, "Grams must be non-negative")
    .nullable()
    .optional(),
  category: z.string().max(100).nullable().optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  status: z.enum(["active", "inactive", "discontinued"]).default("active"),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

// ── Packaging schemas ────────────────────────────────────────

export const packagingCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Packaging name is required")
    .max(100, "Name too long"),
});

export const packagingUpdateSchema = packagingCreateSchema.extend({
  id: z.string().uuid(),
});

export type PackagingCreateInput = z.infer<typeof packagingCreateSchema>;
export type PackagingUpdateInput = z.infer<typeof packagingUpdateSchema>;

// ── Role assignment schema ───────────────────────────────────

export const roleAssignSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(APP_ROLES as unknown as [string, ...string[]], "Invalid role"),
});

export type RoleAssignInput = z.infer<typeof roleAssignSchema>;
