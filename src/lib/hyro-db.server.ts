// Server-only client for the external Hyro Supabase (extension panel DB).
// Never import from client-reachable modules at top-level; use dynamic import.
import { createClient } from "@supabase/supabase-js";

export function getHyroDbConfig() {
  const url = process.env.HYRO_SUPABASE_URL?.trim();
  const key = process.env.HYRO_SUPABASE_ANON_KEY?.trim();
  return { url, key, configured: Boolean(url && key) };
}

export function getHyroDb() {
  const { url, key, configured } = getHyroDbConfig();
  if (!configured || !url || !key) throw new Error("Banco Hyro não configurado no servidor");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
