import { createServerFn } from "@tanstack/react-start";
import { generateLicenseKey, generateLicensePassword, computeExpiresAt } from "./license";

export type TrialLicense = {
  licenseKey: string;
  password: string;
  email: string;
  planLabel: string;
  expiresAt: string;
  reused?: boolean;
};

const onlyDigits = (v: string) => (v || "").replace(/\D+/g, "");
const TRIAL_SOURCE = "site-vendas-trial";
const TRIAL_PLAN_ID = "HYRO-TRIAL10";
const TRIAL_LABEL = "Teste Grátis - 10 MINUTOS";

export const issueTrialLicense = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; email: string; phone?: string }) => {
    if (!data?.name || data.name.trim().length < 2) throw new Error("Nome inválido");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data?.email || "")) throw new Error("E-mail inválido");
    return data;
  })
  .handler(async ({ data }): Promise<TrialLicense> => {
    const { getHyroDb } = await import("./hyro-db.server");
    const db = getHyroDb();
    const email = data.email.trim().toLowerCase();
    const phone = onlyDigits(data.phone || "");

    // Rigid: 1 trial per e-mail. Reuse if still active; block if already used.
    const { data: existing } = await db
      .from("hyro_extension_licenses")
      .select("id,password,expires_at,plan_label,customer_email")
      .eq("customer_email", email)
      .eq("created_source", TRIAL_SOURCE)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const exp = new Date(existing.expires_at);
      if (exp.getTime() > Date.now()) {
        return {
          licenseKey: String(existing.id),
          password: String(existing.password ?? ""),
          email,
          planLabel: String(existing.plan_label ?? TRIAL_LABEL),
          expiresAt: exp.toISOString(),
          reused: true,
        };
      }
      throw new Error("Este e-mail já utilizou o teste grátis. Escolha um plano para continuar.");
    }

    const licenseKey = generateLicenseKey();
    const password = generateLicensePassword();
    const expiresAt = computeExpiresAt("10 MINUTOS");

    // Ensure user exists (FK).
    let userId: string;
    const { data: existingUser } = await db
      .from("hyro_extension_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingUser?.id) {
      userId = String(existingUser.id);
    } else {
      userId = crypto.randomUUID();
      const { error: userErr } = await db.from("hyro_extension_users").insert({
        id: userId,
        email,
        name: data.name.trim(),
        role: "cliente",
        active: true,
        password_hash: password,
        whatsapp: phone || null,
      });
      if (userErr) throw new Error(`Não foi possível registrar o usuário: ${userErr.message}`);
    }

    const { error } = await db.from("hyro_extension_licenses").insert({
      id: licenseKey,
      user_id: userId,
      status: "ativa",
      plan: TRIAL_PLAN_ID,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      created_source: TRIAL_SOURCE,
      plan_label: TRIAL_LABEL,
      password,
      customer_name: data.name.trim(),
      customer_email: email,
      customer_phone: phone || null,
      customer_cpf: null,
      payment_id: `trial-${licenseKey}`,
    });
    if (error) throw new Error(`Não foi possível emitir o teste: ${error.message}`);

    return {
      licenseKey,
      password,
      email,
      planLabel: TRIAL_LABEL,
      expiresAt: expiresAt.toISOString(),
    };
  });
