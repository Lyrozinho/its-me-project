import { createServerFn } from "@tanstack/react-start";

export const adminGetUtmifyConfig = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => {
    if (!d?.token) throw new Error("Token obrigatório");
    return d;
  })
  .handler(async ({ data }) => {
    const { assertUtmifyAdminToken } = await import("./utmify-admin.server");
    assertUtmifyAdminToken(data.token);
    const { getUtmifyConfigRow } = await import("./utmify.server");
    const cfg = await getUtmifyConfigRow();
    const masked = cfg.api_token
      ? `${cfg.api_token.slice(0, 4)}••••${cfg.api_token.slice(-4)}`
      : "";
    return {
      hasToken: !!cfg.api_token,
      apiToken: cfg.api_token,
      tokenPreview: masked,
      platform: cfg.platform,
      enabled: cfg.enabled,
      updatedAt: cfg.updated_at ?? null,
    };
  });

export const adminSaveUtmifyConfig = createServerFn({ method: "POST" })
  .inputValidator((d: {
    token: string;
    api_token?: string;
    platform?: string;
    enabled?: boolean;
  }) => {
    if (!d?.token) throw new Error("Token obrigatório");
    return d;
  })
  .handler(async ({ data }) => {
    const { assertUtmifyAdminToken } = await import("./utmify-admin.server");
    assertUtmifyAdminToken(data.token);
    const { getUtmifyConfigRow, saveUtmifyConfigRow } = await import("./utmify.server");
    const current = await getUtmifyConfigRow();
    const nextToken = data.api_token?.trim() || current.api_token;
    if (!nextToken) throw new Error("Cole o token da Utmify antes de salvar.");
    await saveUtmifyConfigRow({
      api_token: nextToken,
      platform: data.platform?.trim() || current.platform || "LoveHyro",
      enabled: typeof data.enabled === "boolean" ? data.enabled : current.enabled,
    });
    return { ok: true };
  });

export const adminTestUtmify = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => {
    if (!d?.token) throw new Error("Token obrigatório");
    return d;
  })
  .handler(async ({ data }) => {
    const { assertUtmifyAdminToken } = await import("./utmify-admin.server");
    assertUtmifyAdminToken(data.token);
    const { sendUtmifyOrder } = await import("./utmify.server");
    const now = new Date().toISOString();
    const res = await sendUtmifyOrder({
      orderId: `TEST-${Date.now()}`,
      paymentMethod: "pix",
      status: "waiting_payment",
      createdAt: now,
      approvedAt: null,
      customer: {
        name: "Teste Love Hyro",
        email: "teste@lovehyro.store",
        phone: "11999999999",
        document: "12345678909",
      },
      product: { id: "HYRO-TEST", name: "Teste Love Hyro", priceInCents: 100 },
      totalPriceInCents: 100,
      gatewayFeeInCents: 0,
      isTest: true,
    });
    return res;
  });

export const adminListUtmifyEvents = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => {
    if (!d?.token) throw new Error("Token obrigatório");
    return d;
  })
  .handler(async ({ data }) => {
    const { assertUtmifyAdminToken } = await import("./utmify-admin.server");
    assertUtmifyAdminToken(data.token);
    const { listUtmifyLog } = await import("./utmify.server");
    const rows = await listUtmifyLog(30);
    return { events: rows };
  });

