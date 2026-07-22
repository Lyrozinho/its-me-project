import { createServerFn } from "@tanstack/react-start";
import { createCardPaymentServer, getCardPaymentStatusServer, validCPF } from "./mercadopago.server";

function onlyDigits(v: string) { return (v || "").replace(/\D+/g, ""); }

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
    return createCardPaymentServer(data);
  });

export const getCardPaymentStatus = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("ID obrigatório");
    return data;
  })
  .handler(async ({ data }) => {
    return getCardPaymentStatusServer(data.id);
  });
