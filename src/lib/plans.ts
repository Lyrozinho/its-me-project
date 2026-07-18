import loveHyro1h from "@/assets/love-hyro-1h.png.asset.json";
import loveHyro1d from "@/assets/love-hyro-1d.png.asset.json";
import loveHyro3d from "@/assets/love-hyro-3d.png.asset.json";
import loveHyro7d from "@/assets/love-hyro-7d.png.asset.json";
import loveHyro15d from "@/assets/love-hyro-15d.png.asset.json";
import loveHyro30d from "@/assets/love-hyro-30d.png.asset.json";
import { assetUrl } from "@/lib/asset";

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
  { id: "HYRO-01001", duration: "1 HORA",  hours: "60 MINUTOS", title: "Extensão Créditos Lovable Infinitos por 1 Hora (Teste)",   description: "Ideal para testar a extensão Unlimited do Lovable.dev por 60 minutos, com ativação imediata via PIX.",           price: 5,   old: 14.9,   stock: 15, sold: 1284, image: assetUrl(loveHyro1h) },
  { id: "HYRO-01024", duration: "1 DIA",   hours: "24 HORAS",  title: "Extensão Créditos Lovable Infinitos por 1 Dia (24h)",       description: "Extensão Unlimited para Lovable.dev. Tenha créditos infinitos e edite seus projetos sem limites.",             price: 34.9,  old: 41.06,  stock: 10, sold: 886,  image: assetUrl(loveHyro1d) },
  { id: "HYRO-03072", duration: "3 DIAS",  hours: "72 HORAS",  title: "Extensão Créditos Lovable Infinitos por 3 Dias (72h)",      description: "Extensão Unlimited para Lovable.dev. Créditos infinitos por três dias direto no seu navegador.",             price: 69.9,  old: 82.24,  stock: 10, sold: 240,  image: assetUrl(loveHyro3d) },
  { id: "HYRO-07168", duration: "7 DIAS",  hours: "168 HORAS", title: "Extensão Créditos Lovable Infinitos por 7 Dias (168h)",     description: "Extensão Unlimited para Lovable.dev. Uma semana completa de créditos ilimitados e ativação automática.",      price: 98.9,  old: 116.35, stock: 10, sold: 398,  image: assetUrl(loveHyro7d) },
  { id: "HYRO-15360", duration: "15 DIAS", hours: "360 HORAS", title: "Extensão Créditos Lovable Infinitos por 15 Dias (360h)",    description: "Extensão Unlimited para Lovable.dev. Duas semanas de fluxo sem interrupções para projetos grandes.",         price: 169.9, old: 199.9,  stock: 8,  sold: 512,  image: assetUrl(loveHyro15d) },
  { id: "HYRO-30720", duration: "30 DIAS", hours: "720 HORAS", title: "Extensão Créditos Lovable Infinitos por 30 Dias (720h)",    description: "Extensão Unlimited para Lovable.dev. Um mês inteiro de créditos infinitos, o plano preferido dos pros.",     price: 289.9, old: 349.9,  stock: 6,  sold: 731,  image: assetUrl(loveHyro30d) },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatBRL(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}
