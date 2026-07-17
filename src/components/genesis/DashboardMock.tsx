import { motion } from "framer-motion";
import { Sparkles, Code2, Zap, Cpu } from "lucide-react";

export function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(122,92,255,0.22),transparent_65%)] blur-2xl" />

      <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#161029] to-[#0d0819] p-6 sm:p-8 overflow-hidden aspect-[4/5] sm:aspect-square">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(167,139,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.5) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />

        <div className="relative h-full flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white/70 uppercase">
              <Sparkles className="h-3 w-3 text-[#A78BFA]" /> Genesis Hub
            </div>
            <h3 className="mt-5 text-4xl sm:text-5xl font-bold leading-[0.95] tracking-tight">
              O maior hub<br />
              <span className="text-gradient">digital</span><br />
              do Brasil
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { icon: Code2, label: "Automação" },
              { icon: Zap, label: "Instantâneo" },
              { icon: Cpu, label: "IA integrada" },
              { icon: Sparkles, label: "Premium" },
            ].map((p) => (
              <div key={p.label} className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2.5 flex items-center gap-2">
                <p.icon className="h-4 w-4 text-[#A78BFA]" />
                <span className="text-xs font-medium text-white/85">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
        className="absolute -left-4 top-16 hidden md:block"
      >
        <div className="rounded-xl bg-[#1D1638] border border-white/10 px-3 py-2 shadow-xl shadow-black/40">
          <div className="text-[10px] text-white/50">Uptime</div>
          <div className="text-sm font-semibold">99.9%</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
        className="absolute -right-4 bottom-20 hidden md:block"
      >
        <div className="rounded-xl bg-[#1D1638] border border-white/10 px-3 py-2 shadow-xl shadow-black/40">
          <div className="text-[10px] text-white/50">Entrega</div>
          <div className="text-sm font-semibold">24h auto</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
