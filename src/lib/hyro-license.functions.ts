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
    const email = data.customerEmail.trim().toLowerCase();
    const planLabel = `${plan.duration} - ${plan.hours}`;

    // If a license was already issued for this payment (previous attempt succeeded
    // server-side but the client lost the response), reuse it instead of duplicating.
    const { data: existing } = await db
      .from("hyro_extension_licenses")
      .select("id,email,password,expires_at,plan_label")
      .eq("email", email)
      .eq("created_source", "site-vendas")
      .eq("plan_label", planLabel)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing && existing.id) {
      return {
        licenseKey: String(existing.id),
        password: String(existing.password ?? ""),
        email: String(existing.email ?? email),
        planLabel: String(existing.plan_label ?? planLabel),
        expiresAt: new Date(existing.expires_at).toISOString(),
      };
    }

    const licenseKey = generateLicenseKey();
    const password = generateLicensePassword();
    const expiresAt = computeExpiresAt(plan.hours);

    const row = {
      id: licenseKey,
      email,
      password,
      status: "ativa" as const,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      created_source: "site-vendas",
      plan_label: planLabel,
    };

    const { error } = await db.from("hyro_extension_licenses").insert(row);
    if (error) throw new Error(`Não foi possível emitir a licença: ${error.message}`);

    return {
      licenseKey,
      password,
      email,
      planLabel,
      expiresAt: expiresAt.toISOString(),
    };
  });

export type RecoveredLicense = {
  licenseKey: string;
  password: string;
  email: string;
  planLabel: string;
  expiresAt: string;
  createdAt: string;
};

// Recover licenses by e-mail. Used when a buyer lost localStorage (closed browser,
// switched device, etc.) but paid successfully. Only returns licenses created
// through this sales site (created_source='site-vendas').
export const recoverLicensesByEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data?.email || "")) throw new Error("E-mail inválido");
    return { email: data.email.trim().toLowerCase() };
  })
  .handler(async ({ data }): Promise<RecoveredLicense[]> => {
    const { getHyroDb } = await import("./hyro-db.server");
    const db = getHyroDb();
    const { data: rows, error } = await db
      .from("hyro_extension_licenses")
      .select("id,email,password,expires_at,plan_label,created_at")
      .eq("email", data.email)
      .eq("created_source", "site-vendas")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(`Falha ao consultar: ${error.message}`);
    return (rows ?? []).map((r) => ({
      licenseKey: String(r.id),
      password: String(r.password ?? ""),
      email: String(r.email ?? data.email),
      planLabel: String(r.plan_label ?? ""),
      expiresAt: new Date(r.expires_at).toISOString(),
      createdAt: new Date(r.created_at).toISOString(),
    }));
  });
