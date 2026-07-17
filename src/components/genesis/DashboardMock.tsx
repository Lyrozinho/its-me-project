import { motion } from "framer-motion";
import { Activity, TrendingUp, Zap, ArrowUpRight, CheckCircle2 } from "lucide-react";

export function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(122,92,255,0.35),transparent_60%)] blur-2xl" />

      <motion.div
        whileHover={{ rotateX: -2, rotateY: 3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        style={{ transformStyle: "preserve-3d", perspective: 1400 }}
        className="relative rounded-3xl glass-strong p-4 sm:p-5 glow-violet"
      >
        <div className="gradient-border-inner rounded-3xl" />

        {/* Window chrome */}
        <div className="flex items-center gap-2 pb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="ml-3 h-6 flex-1 rounded-md bg-white/5 border border-white/5 flex items-center px-3 text-[11px] text-white/40">
            app.genesishub.io / dashboard
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {/* Sidebar */}
          <div className="col-span-2 rounded-2xl bg-white/[0.03] border border-white/5 p-3 space-y-1">
            {["Overview", "Produtos", "Clientes", "Relatórios", "Integrações"].map((l, i) => (
              <div key={l}
                className={`px-3 py-2 rounded-lg text-[11px] flex items-center gap-2 ${
                  i === 0 ? "bg-gradient-to-r from-[#5B3DF5]/40 to-transparent text-white" : "text-white/50"
                }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" /> {l}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="col-span-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, label: "Receita", value: "R$ 128.4k", delta: "+18.2%" },
                { icon: Activity, label: "Ativos", value: "2.847", delta: "+4.1%" },
                { icon: Zap, label: "Conversão", value: "9.4%", delta: "+1.2%" },
              ].map((k) => (
                <div key={k.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <k.icon className="h-3.5 w-3.5 text-[#A78BFA]" />
                    <span className="text-[10px] text-emerald-300/80">{k.delta}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-white/40">{k.label}</div>
                  <div className="text-sm font-semibold">{k.value}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] text-white/50">Performance</div>
                  <div className="text-sm font-semibold">Últimos 30 dias</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#A78BFA]" />
              </div>
              <svg viewBox="0 0 300 90" className="w-full h-24">
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#7A5CFF" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#7A5CFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 70 L25 55 L50 62 L75 42 L100 48 L125 30 L150 38 L175 22 L200 32 L225 18 L250 26 L275 12 L300 20 L300 90 L0 90 Z"
                  fill="url(#g)"
                />
                <path
                  d="M0 70 L25 55 L50 62 L75 42 L100 48 L125 30 L150 38 L175 22 L200 32 L225 18 L250 26 L275 12 L300 20"
                  fill="none" stroke="#A78BFA" strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Activity */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              {["Novo pedido processado", "Integração ativada", "Cliente premium"].map((t, i) => (
                <div key={t} className="flex items-center gap-3 py-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300/80" />
                  <span className="text-[11px] text-white/70">{t}</span>
                  <span className="ml-auto text-[10px] text-white/30">há {i + 2}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating chip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute -left-6 top-24 hidden md:block"
      >
        <div className="rounded-2xl glass-strong p-3 pr-4 flex items-center gap-3 glow-violet">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] grid place-items-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] text-white/50">Latência média</div>
            <div className="text-sm font-semibold">42ms</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -right-4 bottom-16 hidden md:block"
      >
        <div className="rounded-2xl glass-strong p-3 pr-4 glow-violet">
          <div className="text-[10px] text-white/50">MRR</div>
          <div className="text-lg font-semibold text-gradient">R$ 84.2k</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
