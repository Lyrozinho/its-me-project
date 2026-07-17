import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock, Star, ArrowRight } from "lucide-react";

const cardBase =
  "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#120C24]/80 to-[#0D0819]/80 p-6 transition-all duration-500 hover:border-[#7A5CFF]/40 hover:-translate-y-1";

function Glow() {
  return (
    <>
      {/* Ambient radial glow follows the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(500px circle at var(--x,50%) var(--y,0%), rgba(122,92,255,0.15), transparent 55%)",
        }}
      />
      {/* Top hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)",
        }}
      />
      {/* Sheen on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-y-1 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[400%] transition-all duration-1000 ease-out"
      />
    </>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-11 w-11 rounded-xl border border-white/10 bg-gradient-to-br from-[#7A5CFF]/25 to-[#5B3DF5]/5 grid place-items-center text-[#A78BFA] transition-transform duration-500 group-hover:scale-110 group-hover:border-[#A78BFA]/40">
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_24px_-4px_rgba(167,139,250,0.6)]" />
      {children}
    </div>
  );
}

function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

export function Benefits() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7A5CFF]/30 bg-[#7A5CFF]/10 px-3.5 py-1.5 text-xs text-[#C9BEFF]">
            <Star className="h-3.5 w-3.5" />
            Por que a Genesis Hub
          </div>
          <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
            A plataforma feita para <span className="text-gradient">entregar rápido</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl">
            Infraestrutura confiável, pagamento seguro e liberação instantânea.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Big left card */}
          <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`lg:row-span-2 lg:col-span-1 ${cardBase} min-h-[340px] flex flex-col`}
          >
            <Glow />
            {/* Decorative orb */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[#5B3DF5]/20 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            />
            <IconBadge><Zap className="h-5 w-5" /></IconBadge>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">Entrega 100% automática</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Assim que o PIX é confirmado, seu produto é liberado na hora — sem espera, sem fila e sem precisar falar com ninguém.
            </p>
            <div className="mt-auto pt-8 flex items-center gap-2 text-xs text-[#A78BFA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_10px_#A78BFA] animate-pulse" />
              Liberação em segundos
            </div>
          </motion.div>

          {/* Top row - 2 cards */}
          <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={cardBase}
          >
            <Glow />
            <IconBadge><ShieldCheck className="h-5 w-5" /></IconBadge>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">Pagamento Seguro</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Transações protegidas via PIX com confirmação automática.
            </p>
          </motion.div>

          <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cardBase}
          >
            <Glow />
            <IconBadge><Clock className="h-5 w-5" /></IconBadge>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">Suporte 24/7</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Equipe pronta para ajudar a qualquer momento.
            </p>
          </motion.div>

          {/* Bottom row - 2 cards */}
          <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={cardBase}
          >
            <Glow />
            <IconBadge><Star className="h-5 w-5" /></IconBadge>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">Melhor Preço</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Preços competitivos e pacotes com desconto progressivo.
            </p>
          </motion.div>

          <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${cardBase} border-[#7A5CFF]/25`}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.28 285 / 0.22), oklch(0.19 0.07 285 / 0.7))",
            }}
          >
            <Glow />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#7A5CFF]/30 blur-3xl"
            />
            <IconBadge><ArrowRight className="h-5 w-5" /></IconBadge>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">Pronto para começar?</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Veja os pacotes e ative em segundos.
            </p>
            <a
              href="#produtos"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#C9BEFF] transition-colors group/link"
            >
              Ver planos
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
