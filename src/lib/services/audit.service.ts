import { createClient } from "@/lib/supabase/server";
import type { AuditLog } from "@/lib/types";

export async function createAuditLog(params: {
  actorId: string;
  action: string;
  entity: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_profile_id: params.actorId,
    action: params.action,
    entity: params.entity,
    entity_id: params.entityId ?? null,
    meta_json: params.meta ?? {},
  });
}

export async function getRecentAuditLogs(
  limit = 20,
): Promise<AuditLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*, actor:profiles!actor_profile_id(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AuditLog[];
}
