import { withCardFee } from "./mp-config";
import { getPlanById } from "./plans";

function onlyDigits(v: string) { return (v || "").replace(/\D+/g, ""); }

export function validCPF(cpf: string) {
  const d = onlyDigits(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (base: number) => {
    let sum = 0;
    for (let i = 0; i < base; i++) sum += parseInt(d[i]) * (base + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === parseInt(d[9]) && calc(10) === parseInt(d[10]);
}

async function mpFetch(path: string, init: RequestInit & { idempotencyKey?: string } = {}) {
  const token = process.env.MP_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("MP_ACCESS_TOKEN não configurado");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  if (init.idempotencyKey) headers.set("X-Idempotency-Key", init.idempotencyKey);
  const res = await fetch(`https://api.mercadopago.com${path}`, { ...init, headers });
  const text = await res.text();
  let json: Record<string, unknown> | null = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
  return { status: res.status, json, text };
}

export type CreateCardPaymentServerInput = {
  planId: string;
  token: string;
  paymentMethodId: string;
  issuerId?: string | null;
  customerName: string;
  customerEmail: string;
  customerDocument: string;
};

export async function createCardPaymentServer(data: CreateCardPaymentServerInput) {
  const plan = getPlanById(data.planId);
  if (!plan) throw new Error("Plano não encontrado");
  const amount = withCardFee(plan.price);

  const [first, ...rest] = data.customerName.trim().split(/\s+/);
  const last = rest.join(" ") || first;
  const idempotencyKey = `${data.planId}:${data.token}`.slice(0, 90);

  const body = {
    transaction_amount: amount,
    token: data.token,
    description: `Love Hyro ${plan.duration}`.slice(0, 90),
    installments: 1,
    payment_method_id: data.paymentMethodId,
    ...(data.issuerId ? { issuer_id: data.issuerId } : {}),
    payer: {
      email: data.customerEmail.trim().toLowerCase(),
      first_name: first,
      last_name: last,
      identification: { type: "CPF", number: onlyDigits(data.customerDocument) },
    },
    statement_descriptor: "LOVE HYRO",
    external_reference: `${data.planId}-${Date.now()}`,
  };

  const r = await mpFetch("/v1/payments", {
    method: "POST",
    idempotencyKey,
    body: JSON.stringify(body),
  });

  if (r.status < 200 || r.status >= 300 || !r.json) {
    const msg = (r.json && (r.json as { message?: string }).message)
      || (r.json && (r.json as { cause?: Array<{ description?: string }> }).cause?.[0]?.description)
      || `Falha ao processar cartão (HTTP ${r.status})`;
    console.error("[mp:payment]", r.status, r.text?.slice(0, 500));
    throw new Error(String(msg));
  }

  const payment = r.json as { id?: number | string; status?: string; status_detail?: string };
  return {
    id: String(payment.id ?? ""),
    status: String(payment.status ?? "unknown"),
    statusDetail: String(payment.status_detail ?? ""),
    amount,
  };
}

export async function getCardPaymentStatusServer(id: string) {
  const r = await mpFetch(`/v1/payments/${encodeURIComponent(id)}`, { method: "GET" });
  if (r.status < 200 || r.status >= 300 || !r.json) throw new Error("Falha ao consultar pagamento");
  const p = r.json as { status?: string; status_detail?: string };
  return { status: String(p.status ?? "unknown"), statusDetail: String(p.status_detail ?? "") };
}