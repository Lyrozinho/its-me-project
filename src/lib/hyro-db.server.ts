// Server-only client for the external Hyro Supabase (extension panel DB).
// Never import from client-reachable modules at top-level; use dynamic import.
import { createClient } from "@supabase/supabase-js";

export function getHyroDb() {
  const url = process.env.HYRO_SUPABASE_URL;
  const key = process.env.HYRO_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Hyro Supabase not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
