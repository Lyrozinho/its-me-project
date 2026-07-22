const LOVE_HYRO_1H = "/assets/love-hyro-1h.webp";
const LOVE_HYRO_1D = "/assets/love-hyro-1d.webp";
const LOVE_HYRO_7D = "/assets/love-hyro-7d.webp";
const LOVE_HYRO_15D = "/assets/love-hyro-15d.webp";
const LOVE_HYRO_30D = "/assets/love-hyro-30d.webp";

export type Plan = {
  id: string;
  duration: string;
  hours: string;
  title: string;
  description: string;
  price: number;
  old: number;
  stock: number;
  sold: number;
  image: string;
};

export const PLANS: Plan[] = [
  { id: "HYRO-01001", duration: "1 HORA",  hours: "60 MINUTOS", title: "Extensão Créditos Lovable Infinitos por 1 Hora (Teste)",   description: "Ideal para testar a extensão Unlimited do Lovable.dev por 60 minutos, com ativação imediata via PIX.",           price: 7.90,  old: 7.90,  stock: 82, sold: 3421, image: LOVE_HYRO_1H },
  { id: "HYRO-01024", duration: "1 DIA",   hours: "24 HORAS",  title: "Extensão Créditos Lovable Infinitos por 1 Dia (24h)",       description: "Extensão Unlimited para Lovable.dev. Tenha créditos infinitos e edite seus projetos sem limites.",             price: 19.90, old: 19.90, stock: 74, sold: 2189, image: LOVE_HYRO_1D },
  { id: "HYRO-07168", duration: "7 DIAS",  hours: "168 HORAS", title: "Extensão Créditos Lovable Infinitos por 7 Dias (168h)",     description: "Extensão Unlimited para Lovable.dev. Uma semana completa de créditos ilimitados e ativação automática.",      price: 49.90, old: 49.90, stock: 63, sold: 1876, image: LOVE_HYRO_7D },
  { id: "HYRO-15360", duration: "15 DIAS", hours: "360 HORAS", title: "Extensão Créditos Lovable Infinitos por 15 Dias (360h)",    description: "Extensão Unlimited para Lovable.dev. Duas semanas de fluxo sem interrupções para projetos grandes.",         price: 69.90, old: 69.90, stock: 58, sold: 1204, image: LOVE_HYRO_15D },
  { id: "HYRO-30720", duration: "30 DIAS", hours: "720 HORAS", title: "Extensão Créditos Lovable Infinitos por 30 Dias (720h)",    description: "Extensão Unlimited para Lovable.dev. Um mês inteiro de créditos infinitos, o plano preferido dos pros.",     price: 99.90, old: 99.90, stock: 49, sold: 964,  image: LOVE_HYRO_30D },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatBRL(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}
