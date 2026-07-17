import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Infinity as InfinityIcon, Zap, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Plan = {
  duration: string;
  hours: string;
  title: string;
  description: string;
  price: number;
  old: number;
  stock: number;
  sold: number;
};

const PLANS: Plan[] = [
  { duration: "1 DIA",   hours: "24 HORAS",  title: "Extensão Créditos Lovable Infinitos por 1 Dia (24h)",   description: "Extensão Unlimited para Lovable.dev. Tenha créditos infinitos e edite seus projetos sem limites.", price: 34.9,  old: 41.06,  stock: 10, sold: 886 },
  { duration: "3 DIAS",  hours: "72 HORAS",  title: "Extensão Créditos Lovable Infinitos por 3 Dias (72h)",  description: "Extensão Unlimited para Lovable.dev. Créditos infinitos por três dias direto no seu navegador.", price: 69.9,  old: 82.24,  stock: 10, sold: 240 },
  { duration: "7 DIAS",  hours: "168 HORAS", title: "Extensão Créditos Lovable Infinitos por 7 Dias (168h)", description: "Extensão Unlimited para Lovable.dev. Uma semana completa de créditos ilimitados e ativação automática.", price: 98.9,  old: 116.35, stock: 10, sold: 398 },
  { duration: "15 DIAS", hours: "360 HORAS", title: "Extensão Créditos Lovable Infinitos por 15 Dias (360h)", description: "Extensão Unlimited para Lovable.dev. Duas semanas de fluxo sem interrupções para projetos grandes.", price: 169.9, old: 199.9,  stock: 8,  sold: 512 },
  { duration: "30 DIAS", hours: "720 HORAS", title: "Extensão Créditos Lovable Infinitos por 30 Dias (720h)", description: "Extensão Unlimited para Lovable.dev. Um mês inteiro de créditos infinitos, o plano preferido dos pros.", price: 289.9, old: 349.9,  stock: 6,  sold: 731 },
];

const FEATURES = [
  { icon: InfinityIcon, label: "CRÉDITOS", value: "INFINITOS" },
  { icon: Zap,          label: "ATIVAÇÃO", value: "AUTOMÁTICA" },
  { icon: ShieldCheck,  label: "100% SEGURO", value: "E CONFIÁVEL" },
  { icon: Clock,        label: "DURAÇÃO",  value: "" },
];

export function FeaturedProducts() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section id="produtos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            align="left"
            eyebrow="Planos"
            title={<>Extensão <span className="text-gradient">Créditos Infinitos</span></>}
            description="Escolha a duração ideal e ative na hora. PIX, entrega automática e suporte dedicado."
          />
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-white/85">
            <Clock className="h-4 w-4 text-[#A78BFA]" />
            Teste grátis de 10min
          </div>
        </div>

        <div className="relative mt-12">
          {/* Arrows */}
          <button
            aria-label="Anterior"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full glass-strong border border-white/10 text-white/90 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Próximo"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full glass-strong border border-white/10 text-white/90 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-[#0B0715] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-[#0B0715] to-transparent" />

          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5 lg:mx-0 lg:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {PLANS.map((p, i) => (
              <PlanCard key={p.duration} plan={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <motion.article
      data-card
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative snap-start shrink-0 w-[300px] sm:w-[340px] rounded-3xl glass overflow-hidden border border-white/10 transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(91,61,245,0.55)]"
    >
      <div className="gradient-border-inner rounded-3xl" />

      {/* Visual header */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#1D1638] via-[#131024] to-[#0B0715]">
        <div className="absolute inset-0 grid-tech opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(122,92,255,0.35),transparent_55%)]" />
        <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-[#5B3DF5]/30 blur-3xl" />

        {/* Badges top */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#5B3DF5] px-2.5 py-1 text-[10px] font-bold text-white shadow-[0_6px_20px_-6px_rgba(91,61,245,0.9)]">
            -15% OFF
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-white/90 border border-white/10">
            <Clock className="h-3 w-3" /> {plan.duration}
          </span>
        </div>

        {/* Centerpiece: big duration */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <div className="text-[11px] font-semibold tracking-[0.3em] text-white/50">EXTENSÃO</div>
          <div className="mt-1 text-4xl sm:text-5xl font-black tracking-tight leading-none">
            <span className="text-gradient">CRÉDITOS</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight leading-none mt-1">INFINITOS</div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1 text-[11px] font-semibold text-white/90 border border-white/15">
            <Zap className="h-3 w-3 text-[#A78BFA]" /> LOVABLE • {plan.duration}
          </div>
        </div>

        {/* Feature strip */}
        <div className="absolute inset-x-3 bottom-3 rounded-xl glass-strong border border-white/10 px-3 py-2 grid grid-cols-4 gap-2">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <f.icon className="h-3.5 w-3.5 text-[#A78BFA]" />
              <div className="mt-1 text-[8px] font-bold tracking-wider text-white/80 leading-tight">{f.label}</div>
              <div className="text-[8px] font-semibold text-white/50 leading-tight">
                {i === 3 ? plan.hours : f.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="relative p-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> AUTO
          </span>
          <span className="text-white/30">•</span>
          <span className="text-white/70">ESTOQUE: <span className="text-white font-bold">{plan.stock}</span></span>
          <span className="text-white/30">•</span>
          <span className="text-white/70">VENDIDAS: <span className="text-[#A78BFA] font-bold">{plan.sold}</span></span>
        </div>

        <h3 className="mt-3 text-[15px] font-bold tracking-tight leading-snug text-gradient">
          {plan.title}
        </h3>
        <p className="mt-2 text-[13px] text-white/55 leading-relaxed line-clamp-2">
          {plan.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <div className="text-xs text-white/40 line-through">R$ {plan.old.toFixed(2).replace(".", ",")}</div>
            <div className="text-2xl font-black tracking-tight">
              R$ <span className="text-gradient">{plan.price.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 h-11 px-4 rounded-full text-xs font-bold tracking-wider text-white bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] shadow-[0_10px_30px_-10px_rgba(91,61,245,0.8)] hover:brightness-110 hover:-translate-y-0.5 transition-all">
            <ShoppingBag className="h-4 w-4" /> COMPRAR
          </button>
        </div>
      </div>
    </motion.article>
  );
}
