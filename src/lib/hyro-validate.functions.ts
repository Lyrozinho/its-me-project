import { createServerFn } from "@tanstack/react-start";

export type ValidatedLicense = {
  valid: boolean;
  reason?: string;
  planLabel?: string;
  expiresAt?: string;
};

export const validateLicense = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string }) => {
    if (!data?.key || data.key.trim().length < 4) throw new Error("Chave inválida");
    return { key: data.key.trim() };
  })
  .handler(async ({ data }): Promise<ValidatedLicense> => {
    const { getHyroDb } = await import("./hyro-db.server");
    const db = getHyroDb();
    const { data: row, error } = await db
      .from("hyro_extension_licenses")
      .select("id,status,expires_at,plan_label")
      .eq("id", data.key)
      .maybeSingle();
    if (error) return { valid: false, reason: "Erro ao validar." };
    if (!row) return { valid: false, reason: "Chave não encontrada." };
    const expires = new Date(row.expires_at);
    if (Number.isFinite(expires.getTime()) && expires.getTime() < Date.now()) {
      return { valid: false, reason: "Licença expirada." };
    }
    if (row.status && String(row.status).toLowerCase() !== "ativa") {
      return { valid: false, reason: "Licença inativa." };
    }
    return {
      valid: true,
      planLabel: String(row.plan_label ?? ""),
      expiresAt: expires.toISOString(),
    };
  });
