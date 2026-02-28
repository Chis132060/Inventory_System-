// Centralized type definitions for the Inventory system

export const APP_ROLES = [
  "UNASSIGNED",
  "ADMIN",
  "SUPERVISOR",
  "INVENTORY_MANAGER",
  "SALESMAN",
  "BUYER",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  packaging_id: string | null;
  grams: number | null;
  category: string | null;
  price: number;
  status: "active" | "inactive" | "discontinued";
  created_at: string;
  // Joined
  packaging?: Packaging | null;
}

export interface Packaging {
  id: string;
  name: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_profile_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  meta_json: Record<string, unknown>;
  created_at: string;
  // Joined
  actor?: Pick<Profile, "email" | "full_name"> | null;
}

// Server action return type
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
