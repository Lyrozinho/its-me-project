// Admin token for the /utmify panel.
// Value is stored as UTMIFY_ADMIN_TOKEN in the server environment (never in code).
// Comparison is timing-safe to prevent side-channel token discovery.

function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function assertUtmifyAdminToken(token: string) {
  const expected = process.env.UTMIFY_ADMIN_TOKEN?.trim();
  if (!expected) throw new Error("Admin não configurado");
  if (!token || !timingSafeEqual(token, expected)) throw new Error("Acesso negado");
}
