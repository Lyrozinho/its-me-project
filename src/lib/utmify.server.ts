// Utmify integration — outgoing order webhooks.
// Server-only. Config lives in the external Hyro Supabase (hyro_utmify_config table).
import { getHyroDb, getHyroDbConfig } from "./hyro-db.server";

export type UtmifyConfig = {
  api_token: string;
  platform: string;
  enabled: boolean;
  updated_at?: string | null;
};

function envConfig(): UtmifyConfig {
  return {
    api_token: process.env.UTMIFY_API_TOKEN?.trim() ?? "",
    platform: process.env.UTMIFY_PLATFORM?.trim() || "LoveHyro",
    enabled: process.env.UTMIFY_ENABLED !== "false",
    updated_at: null,
  };
}

export async function getUtmifyConfigRow(): Promise<UtmifyConfig> {
  const fallback = envConfig();
  const { configured } = getHyroDbConfig();
  if (!configured) return fallback;

  try {
    const db = getHyroDb();
    const { data, error } = await db
      .from("hyro_utmify_config")
      .select("api_token,platform,enabled,updated_at")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("[utmify:config]", error.message);
      return fallback;
    }

    const rowToken = String(data?.api_token || "").trim();
    const finalToken = rowToken || fallback.api_token;

    // Auto-heal: if the DB row is missing/empty but env has a token, persist it
    // so the panel reflects an "Ativo" state on next load.
    if (!rowToken && fallback.api_token) {
      try {
        await db.from("hyro_utmify_config").upsert({
          id: 1,
          api_token: fallback.api_token,
          platform: data?.platform || fallback.platform,
          enabled: data?.enabled ?? fallback.enabled,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error("[utmify:autoheal]", e instanceof Error ? e.message : String(e));
      }
    }

    return {
      api_token: finalToken,
      platform: String(data?.platform || fallback.platform),
      enabled: data?.enabled ?? fallback.enabled,
      updated_at: data?.updated_at ?? null,
    };
  } catch (e) {
    console.error("[utmify:config]", e instanceof Error ? e.message : String(e));
    return fallback;
  }
}


export async function saveUtmifyConfigRow(c: UtmifyConfig): Promise<void> {
  const { configured } = getHyroDbConfig();
  if (!configured) {
    // The production flow can still use UTMIFY_API_TOKEN from encrypted secrets.
    // Avoid blocking the admin panel with a DB-only configuration error.
    return;
  }

  const db = getHyroDb();
  const { error } = await db.from("hyro_utmify_config").upsert({
    id: 1,
    api_token: c.api_token || "",
    platform: c.platform || "LoveHyro",
    enabled: !!c.enabled,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

function toUtcSql(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

export type UtmifyTracking = {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

export type UtmifyOrderInput = {
  orderId: string;
  paymentMethod: "pix" | "credit_card";
  status: "waiting_payment" | "paid" | "refused" | "refunded" | "chargedback";
  createdAt: string; // ISO
  approvedAt?: string | null;
  customer: {
    name: string;
    email: string;
    phone?: string | null;
    document?: string | null;
    ip?: string | null;
  };
  product: { id: string; name: string; priceInCents: number };
  totalPriceInCents: number;
  gatewayFeeInCents?: number;
  tracking?: UtmifyTracking | null;
  isTest?: boolean;
};

export async function sendUtmifyOrder(
  input: UtmifyOrderInput,
): Promise<{ ok: boolean; status?: number; message?: string }> {
  const cfg = await getUtmifyConfigRow();
  if (!cfg.enabled) return { ok: false, message: "utmify disabled" };
  if (!cfg.api_token) return { ok: false, message: "utmify token not set" };

  const gatewayFee = Math.max(0, Math.floor(input.gatewayFeeInCents ?? 0));
  const total = Math.max(0, Math.floor(input.totalPriceInCents));
  const commission = Math.max(1, total - gatewayFee);

  const body = {
    orderId: input.orderId,
    platform: cfg.platform || "LoveHyro",
    paymentMethod: input.paymentMethod,
    status: input.status,
    createdAt: toUtcSql(input.createdAt),
    approvedDate: input.approvedAt ? toUtcSql(input.approvedAt) : null,
    refundedAt: null,
    customer: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone || null,
      document: input.customer.document || null,
      country: "BR",
      // Utmify recusa customer.ip null com SCHEMA_VALIDATION_FAILED.
      // Sempre enviar um IP válido (usa o real quando disponível).
      ip: (input.customer.ip && input.customer.ip.trim()) || "0.0.0.0",
    },
    products: [
      {
        id: input.product.id,
        name: input.product.name,
        planId: null,
        planName: null,
        quantity: 1,
        priceInCents: input.product.priceInCents,
      },
    ],
    trackingParameters: {
      src: input.tracking?.src ?? null,
      sck: input.tracking?.sck ?? null,
      utm_source: input.tracking?.utm_source ?? null,
      utm_campaign: input.tracking?.utm_campaign ?? null,
      utm_medium: input.tracking?.utm_medium ?? null,
      utm_content: input.tracking?.utm_content ?? null,
      utm_term: input.tracking?.utm_term ?? null,
    },
    commission: {
      totalPriceInCents: total,
      gatewayFeeInCents: gatewayFee,
      userCommissionInCents: commission,
    },
    isTest: !!input.isTest,
  };

  const attempt = async (): Promise<{ ok: boolean; status?: number; message?: string }> => {
    try {
      const r = await fetch("https://api.utmify.com.br/api-credentials/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-token": cfg.api_token,
        },
        body: JSON.stringify(body),
      });
      const t = await r.text();
      if (r.status < 200 || r.status >= 300) {
        console.error("[utmify]", r.status, t.slice(0, 400));
        return { ok: false, status: r.status, message: t.slice(0, 400) };
      }
      return { ok: true, status: r.status };
    } catch (e) {
      console.error("[utmify:err]", e);
      return { ok: false, message: e instanceof Error ? e.message : String(e) };
    }
  };

  const result = await attempt();

  // Best-effort event log to display in the admin panel.
  try {
    const { configured } = getHyroDbConfig();
    if (configured) {
      const db = getHyroDb();
      await db.from("hyro_utmify_log").insert({
        order_id: input.orderId,
        status: input.status,
        payment_method: input.paymentMethod,
        amount_cents: input.totalPriceInCents,
        customer_email: input.customer.email,
        ok: result.ok,
        http_status: result.status ?? null,
        error_message: result.ok ? null : (result.message ?? null),
        is_test: !!input.isTest,
      });
    }
  } catch (e) {
    // ignore log failures — table may not exist yet
    console.error("[utmify:log]", e instanceof Error ? e.message : String(e));
  }

  return result;
}

export type UtmifyLogRow = {
  id: number;
  created_at: string;
  order_id: string;
  status: string;
  payment_method: string;
  amount_cents: number;
  customer_email: string;
  ok: boolean;
  http_status: number | null;
  error_message: string | null;
  is_test: boolean;
};

export async function listUtmifyLog(limit = 25): Promise<UtmifyLogRow[]> {
  const { configured } = getHyroDbConfig();
  if (!configured) return [];
  try {
    const db = getHyroDb();
    const { data, error } = await db
      .from("hyro_utmify_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as UtmifyLogRow[];
  } catch {
    return [];
  }
}
