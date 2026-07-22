const ADMIN_TOKEN = "santiago";

export function assertUtmifyAdminToken(token: string) {
  if (!token || token !== ADMIN_TOKEN) throw new Error("Acesso negado");
}
