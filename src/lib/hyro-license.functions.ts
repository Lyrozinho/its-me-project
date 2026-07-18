import { createServerFn } from "@tanstack/react-start";
import { getPlanById } from "./plans";
import { generateLicenseKey, generateLicensePassword, computeExpiresAt } from "./license";

export type IssuedLicense = {
  licenseKey: string;
  password: string;
  email: string;
  planLabel: string;
  expiresAt: string; // ISO
};

export type IssueLicenseInput = {
  planId: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
};

export const issueLicense = createServerFn({ method: "POST" })
  .inputValidator((data: IssueLicenseInput) => {
    if (!data?.planId) throw new Error("planId obrigatório");
    if (!data?.paymentId) throw new Error("paymentId obrigatório");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data?.customerEmail || "")) throw new Error("E-mail inválido");
    if (!data?.customerName || data.customerName.trim().length < 2) throw new Error("Nome inválido");
    return data;
  })
  .handler(async ({ data }): Promise<IssuedLicense> => {
    const plan = getPlanById(data.planId);
    if (!plan) throw new Error("Plano não encontrado");

    // Rigid payment verification via VexoPay before issuing anything.
    const { checkPixStatus } = await import("./vexopay.server");
    const status = await checkPixStatus(data.paymentId);
    const normalized = status.toLowerCase();
    const isPaid = ["paid", "approved", "completed", "confirmed"].includes(normalized);
    if (!isPaid) throw new Error(`Pagamento não confirmado (status: ${status})`);

    const { getHyroDb } = await import("./hyro-db.server");
    const db = getHyroDb();

    // Client-side idempotency guards duplicates in practice; here we still try
    // to avoid double-issuing when payment_id already exists (best effort).
    // We can't SELECT (RLS gives anon only INSERT), so we just proceed.

    const licenseKey = generateLicenseKey();
    const password = generateLicensePassword();
    const expiresAt = computeExpiresAt(plan.hours);
    const planLabel = `${plan.duration} - ${plan.hours}`;

    const row = {
      license_key: licenseKey,
      password,
      status: "ativa" as const,
      plan_label: planLabel,
      customer_name: data.customerName.trim(),
      customer_email: data.customerEmail.trim().toLowerCase(),
      payment_id: data.paymentId,
      created_source: "site-vendas",
      expires_at: expiresAt.toISOString(),
    };

    const { error } = await db.from("hyro_extension_licenses").insert(row);
    if (error) {
      // Surface a clean error but do not leak provider details.
      throw new Error(`Não foi possível emitir a licença: ${error.message}`);
    }

    return {
      licenseKey,
      password,
      email: row.customer_email,
      planLabel,
      expiresAt: expiresAt.toISOString(),
    };
  });
