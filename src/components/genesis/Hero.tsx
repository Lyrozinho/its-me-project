import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Users, Star } from "lucide-react";
import { DashboardMock } from "./DashboardMock";

export function Hero() {
  return (
    <section id="hero" className="relative pt-36 pb-20 lg:pt-44 lg:pb-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-white/80"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#A78BFA] opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#A78BFA]" />
              Nova versão 3.0 disponível
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-[44px] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] leading-[0.98]"
            >
              A plataforma <span className="text-gradient">definitiva</span> para escalar seu negócio digital.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-base sm:text-lg text-white/60 leading-relaxed"
            >
              Reúna produtos, revendedores e clientes em um único hub premium.
              Automação, análises em tempo real e uma experiência refinada até o último pixel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <button className="group h-12 px-6 rounded-full text-sm font-medium text-white bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] shadow-[0_20px_50px_-15px_rgba(91,61,245,0.8)] hover:brightness-110 transition-all inline-flex items-center gap-2">
                Começar agora
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="h-12 px-6 rounded-full text-sm font-medium glass hover:bg-white/10 transition-colors">
                Explorar produtos
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-lg"
            >
              {[
                { icon: Users, k: "18k+", v: "Clientes ativos" },
                { icon: Star, k: "4.9/5", v: "Avaliação média" },
                { icon: ShieldCheck, k: "99.9%", v: "Uptime garantido" },
              ].map((s) => (
                <div key={s.v}>
                  <s.icon className="h-4 w-4 text-[#A78BFA] mb-2" />
                  <div className="text-xl font-semibold tracking-tight">{s.k}</div>
                  <div className="text-[11px] text-white/50 mt-0.5">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}
