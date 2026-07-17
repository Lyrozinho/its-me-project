import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Infinity as InfinityIcon, Zap, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import loveHyro1d from "@/assets/love-hyro-1d.png.asset.json";
import loveHyro3d from "@/assets/love-hyro-3d.png.asset.json";
import loveHyro7d from "@/assets/love-hyro-7d.png.asset.json";
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
  image?: string;
};

const PLANS: Plan[] = [
  { duration: "1 DIA",   hours: "24 HORAS",  title: "Extensão Créditos Lovable Infinitos por 1 Dia (24h)",   description: "Extensão Unlimited para Lovable.dev. Tenha créditos infinitos e edite seus projetos sem limites.", price: 34.9,  old: 41.06,  stock: 10, sold: 886, image: loveHyro1d.url },
  { duration: "3 DIAS",  hours: "72 HORAS",  title: "Extensão Créditos Lovable Infinitos por 3 Dias (72h)",  description: "Extensão Unlimited para Lovable.dev. Créditos infinitos por três dias direto no seu navegador.", price: 69.9,  old: 82.24,  stock: 10, sold: 240, image: loveHyro3d.url },
  { duration: "7 DIAS",  hours: "168 HORAS", title: "Extensão Créditos Lovable Infinitos por 7 Dias (168h)", description: "Extensão Unlimited para Lovable.dev. Uma semana completa de créditos ilimitados e ativação automática.", price: 98.9,  old: 116.35, stock: 10, sold: 398, image: loveHyro7d.url },
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
      className="group relative snap-start shrink-0 w-[320px] sm:w-[360px] rounded-3xl bg-[#0F0A20] border border-white/[0.07] hover:border-white/15 transition-all duration-500 hover:shadow-[0_20px_60px_-30px_rgba(122,92,255,0.5)]"
    >
      {/* Soft ambient glow (hover) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 60%, rgba(122,92,255,0.18), transparent 70%)",
        }}
      />
      <div className="relative rounded-3xl overflow-hidden">


      {/* Visual header */}
      <div className="relative m-3 h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1A1236] via-[#120C24] to-[#0A0616]">
        {plan.image ? (
          <>
            <motion.img
              src={plan.image}
              alt={plan.title}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              draggable={false}
            />
            {/* Subtle inner vignette to blend with card */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            {/* Sheen on hover */}
            <div className="pointer-events-none absolute -inset-x-1/2 -top-1/2 h-[200%] w-[60%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-1000 ease-out" />
            {/* Glow on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_60px_rgba(122,92,255,0.35)]" />
            {/* Top-left offer badge */}
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#5B3DF5] px-3 py-1 text-[11px] font-black text-white shadow-[0_6px_20px_-6px_rgba(91,61,245,0.9)]">
              <Zap className="h-3 w-3" /> -15% OFF
            </span>
          </>
        ) : (
          <>
            <div className="absolute inset-0 grid-tech opacity-30" />
            <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#5B3DF5]/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#7A5CFF]/25 blur-3xl" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#5B3DF5] px-3 py-1 text-[11px] font-black text-white shadow-[0_6px_20px_-6px_rgba(91,61,245,0.9)]">
                <Zap className="h-3 w-3" /> -15% OFF
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] font-bold text-white/90 border border-white/10">
                <Clock className="h-3 w-3" /> {plan.duration}
              </span>
            </div>

            {/* Big diagonal title */}
            <div className="absolute top-4 right-3 text-right leading-[0.85] select-none z-10">
              <div className="text-[11px] font-bold tracking-[0.25em] text-white/40">EXTENSÃO</div>
              <div className="mt-1 text-[32px] font-black italic tracking-tight text-gradient drop-shadow-[0_4px_20px_rgba(122,92,255,0.35)]">
                CRÉDITOS
              </div>
              <div className="text-[36px] font-black italic tracking-tight text-white drop-shadow-[0_4px_20px_rgba(122,92,255,0.35)]">
                INFINITOS
              </div>
              <div className="mt-2 inline-flex items-center gap-2 text-[13px] font-black tracking-wider text-white/85 justify-end">
                LOVABLE
                <span className="rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-[11px] text-white">
                  {plan.hours.replace(" HORAS", "h")}
                </span>
              </div>
            </div>

            {/* Feature list left column */}
            <div className="absolute left-3 top-[120px] flex flex-col gap-2.5 z-10">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full grid place-items-center bg-white/5 border border-[#A78BFA]/30 shadow-[0_0_20px_-6px_rgba(167,139,250,0.6)]">
                    <f.icon className="h-3.5 w-3.5 text-[#A78BFA]" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[9px] font-black tracking-wider text-white/85">{f.label}</div>
                    <div className="text-[9px] font-semibold text-white/45">
                      {i === 3 ? plan.hours : f.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom duration pill */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 rounded-2xl bg-black/60 backdrop-blur border border-white/10 px-3 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
              <div className="h-9 w-9 rounded-full grid place-items-center bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-black text-white">{plan.duration}</div>
                <div className="text-[10px] font-semibold text-white/50">({plan.hours})</div>
              </div>
            </div>

            {/* Decorative orb (character replacement) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 right-6 h-28 w-28 pointer-events-none"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A78BFA] via-[#7A5CFF] to-[#5B3DF5] opacity-90" />
              <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#1A1236] to-[#0A0616] border border-white/10 grid place-items-center">
                <InfinityIcon className="h-12 w-12 text-white drop-shadow-[0_0_20px_rgba(167,139,250,0.9)]" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-4 rounded-full bg-[#7A5CFF]/30 blur-2xl -z-10" />
            </motion.div>
          </>
        )}
      </div>


      {/* Body */}
      <div className="relative px-5 pb-5 pt-1">
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> AUTO
          </span>
          <span className="text-white/25">•</span>
          <span className="text-white/60">ESTOQUE: <span className="text-white font-black">{plan.stock}</span></span>
          <span className="text-white/25">•</span>
          <span className="text-white/60">VENDIDAS: <span className="text-[#A78BFA] font-black">{plan.sold}</span></span>
        </div>

        <h3 className="mt-3 text-[16px] font-black tracking-tight leading-snug text-white">
          {plan.title}
        </h3>
        <p className="mt-2 text-[13px] text-white/50 leading-relaxed line-clamp-2">
          {plan.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <div className="text-xs text-white/35 line-through">R$ {plan.old.toFixed(2).replace(".", ",")}</div>
            <div className="text-3xl font-black tracking-tight">
              R$ <span className="text-gradient">{plan.price.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-[13px] font-black tracking-wider text-white bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] shadow-[0_10px_30px_-10px_rgba(91,61,245,0.9)] hover:brightness-110 hover:-translate-y-0.5 transition-all">
            COMPRAR <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      </div>
    </motion.article>

  );
}
