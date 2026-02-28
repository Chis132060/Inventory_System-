import { createClient } from "@/lib/supabase/server";
import type { Packaging } from "@/lib/types";
import type { PackagingCreateInput } from "@/lib/validators";

export async function getAllPackaging(): Promise<Packaging[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packaging")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Packaging[];
}

export async function getPackagingById(id: string): Promise<Packaging | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packaging")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Packaging;
}

export async function createPackaging(
  input: PackagingCreateInput,
): Promise<Packaging> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packaging")
    .insert({ name: input.name })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Packaging;
}

export async function updatePackaging(
  id: string,
  input: PackagingCreateInput,
): Promise<Packaging> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packaging")
    .update({ name: input.name })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Packaging;
}

export async function deletePackaging(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("packaging").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getPackagingCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("packaging")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
