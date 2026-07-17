import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { DashboardMock } from "./DashboardMock";

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white/70"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#A78BFA] opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
              </span>
              Disponível agora
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.02]"
            >
              Escale seu negócio<br />
              digital com o<br />
              <span className="text-gradient">Genesis Hub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg text-base sm:text-lg text-white/60 leading-relaxed"
            >
              A plataforma completa para revendedores e criadores digitais. Produtos premium,
              entrega automática e pagamento via PIX com liberação instantânea.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button className="group h-12 px-6 rounded-full text-sm font-semibold text-white bg-[#5B3DF5] hover:bg-[#6a4cf7] transition-colors inline-flex items-center gap-2 shadow-[0_10px_30px_-10px_rgba(91,61,245,0.7)]">
                Ver produtos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="h-12 px-6 rounded-full text-sm font-semibold text-white bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#A78BFA]" />
                Como funciona
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-8 max-w-md"
            >
              {[
                { k: "+18k", v: "Pedidos entregues" },
                { k: "+10k", v: "Clientes ativos" },
                { k: "24/7", v: "Suporte dedicado" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold tracking-tight">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/45 mt-1">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <DashboardMock />
        </div>
      </div>
    </section>
  );
}
