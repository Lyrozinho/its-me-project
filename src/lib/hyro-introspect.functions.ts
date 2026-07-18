import { createServerFn } from "@tanstack/react-start";

export const introspectHyro = createServerFn({ method: "GET" }).handler(async () => {
  const { getHyroDb } = await import("./hyro-db.server");
  const db = getHyroDb();
  const { data, error } = await db
    .from("hyro_extension_licenses")
    .select("*")
    .limit(1);
  return { error: error?.message ?? null, columns: data && data[0] ? Object.keys(data[0]) : [], sample: data?.[0] ?? null };
});
