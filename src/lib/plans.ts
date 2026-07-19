const LOVE_HYRO_1H = "/assets/love-hyro-1h.png";
const LOVE_HYRO_1D = "/assets/love-hyro-1d.png";
const LOVE_HYRO_3D = "/assets/love-hyro-3d.png";
const LOVE_HYRO_7D = "/assets/love-hyro-7d.png";
const LOVE_HYRO_15D = "/assets/love-hyro-15d.png";
const LOVE_HYRO_30D = "/assets/love-hyro-30d.png";

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
  { id: "HYRO-01001", duration: "1 HORA",  hours: "60 MINUTOS", title: "Extensão Créditos Lovable Infinitos por 1 Hora (Teste)",   description: "Ideal para testar a extensão Unlimited do Lovable.dev por 60 minutos, com ativação imediata via PIX.",           price: 5,   old: 14.9,   stock: 15, sold: 1284, image: LOVE_HYRO_1H },
  { id: "HYRO-01024", duration: "1 DIA",   hours: "24 HORAS",  title: "Extensão Créditos Lovable Infinitos por 1 Dia (24h)",       description: "Extensão Unlimited para Lovable.dev. Tenha créditos infinitos e edite seus projetos sem limites.",             price: 34.9,  old: 41.06,  stock: 10, sold: 886,  image: LOVE_HYRO_1D },
  { id: "HYRO-03072", duration: "3 DIAS",  hours: "72 HORAS",  title: "Extensão Créditos Lovable Infinitos por 3 Dias (72h)",      description: "Extensão Unlimited para Lovable.dev. Créditos infinitos por três dias direto no seu navegador.",             price: 69.9,  old: 82.24,  stock: 10, sold: 240,  image: LOVE_HYRO_3D },
  { id: "HYRO-07168", duration: "7 DIAS",  hours: "168 HORAS", title: "Extensão Créditos Lovable Infinitos por 7 Dias (168h)",     description: "Extensão Unlimited para Lovable.dev. Uma semana completa de créditos ilimitados e ativação automática.",      price: 98.9,  old: 116.35, stock: 10, sold: 398,  image: LOVE_HYRO_7D },
  { id: "HYRO-15360", duration: "15 DIAS", hours: "360 HORAS", title: "Extensão Créditos Lovable Infinitos por 15 Dias (360h)",    description: "Extensão Unlimited para Lovable.dev. Duas semanas de fluxo sem interrupções para projetos grandes.",         price: 169.9, old: 199.9,  stock: 8,  sold: 512,  image: LOVE_HYRO_15D },
  { id: "HYRO-30720", duration: "30 DIAS", hours: "720 HORAS", title: "Extensão Créditos Lovable Infinitos por 30 Dias (720h)",    description: "Extensão Unlimited para Lovable.dev. Um mês inteiro de créditos infinitos, o plano preferido dos pros.",     price: 289.9, old: 349.9,  stock: 6,  sold: 731,  image: LOVE_HYRO_30D },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatBRL(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}
