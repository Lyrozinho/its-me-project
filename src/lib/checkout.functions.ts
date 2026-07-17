import { createServerFn } from "@tanstack/react-start";
import { getPlanById } from "./plans";

function onlyDigits(v: string) { return v.replace(/\D+/g, ""); }
function validCPF(cpf: string) {
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

export type CreatePixInput = {
  planId: string;
  customerName: string;
  customerEmail: string;
  customerDocument: string;
};

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePixInput) => {
    if (!data || typeof data !== "object") throw new Error("Payload inválido");
    if (!data.planId) throw new Error("Plano obrigatório");
    if (!data.customerName || data.customerName.trim().length < 3) throw new Error("Nome inválido");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail || "")) throw new Error("E-mail inválido");
    if (!validCPF(data.customerDocument || "")) throw new Error("CPF inválido");
    return data;
  })
  .handler(async ({ data }) => {
    const plan = getPlanById(data.planId);
    if (!plan) throw new Error("Plano não encontrado");
    const amountCents = Math.round(plan.price * 100);
    if (amountCents < 100) throw new Error("Valor mínimo R$ 1,00");

    const { createPix } = await import("./vexopay.server");
    const charge = await createPix({
      amountCents,
      description: `Love Hyro ${plan.duration}`.slice(0, 80),
      customerName: data.customerName.trim(),
      customerDocument: data.customerDocument.replace(/\D/g, ""),
    });
    return { ...charge, amount: plan.price };
  });

export const getPixStatus = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("ID obrigatório");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkPixStatus } = await import("./vexopay.server");
    const status = await checkPixStatus(data.id);
    return { status };
  });
