import { createServerFn } from "@tanstack/react-start";

function onlyDigits(v: string) { return (v || "").replace(/\D+/g, ""); }
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

export type CreateCardPaymentInput = {
  planId: string;
  token: string;
  paymentMethodId: string;
  issuerId?: string | null;
  customerName: string;
  customerEmail: string;
  customerDocument: string;
};

export type CreateCardPaymentResult = {
  id: string;
  status: string;              // approved | in_process | rejected | ...
  statusDetail: string;
  amount: number;
};

export const createCardPayment = createServerFn({ method: "POST" })
  .inputValidator((data: CreateCardPaymentInput) => {
    if (!data || typeof data !== "object") throw new Error("Payload inválido");
    if (!data.planId) throw new Error("Plano obrigatório");
    if (!data.token) throw new Error("Token do cartão ausente");
    if (!data.paymentMethodId) throw new Error("Bandeira não identificada");
    if (!data.customerName || data.customerName.trim().length < 3) throw new Error("Nome inválido");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail || "")) throw new Error("E-mail inválido");
    if (!validCPF(data.customerDocument || "")) throw new Error("CPF inválido");
    return data;
  })
  .handler(async ({ data }): Promise<CreateCardPaymentResult> => {
    const { createCardPaymentServer } = await import("./mercadopago.server");
    return createCardPaymentServer(data);
  });

export const getCardPaymentStatus = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("ID obrigatório");
    return data;
  })
  .handler(async ({ data }) => {
    const { getCardPaymentStatusServer } = await import("./mercadopago.server");
    return getCardPaymentStatusServer(data.id);
  });
