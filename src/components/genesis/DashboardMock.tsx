import { motion } from "framer-motion";
import heroVisual from "@/assets/hero-visual.png.asset.json";

export function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(122,92,255,0.28),transparent_65%)] blur-2xl" />

      <div className="relative rounded-[2rem] border border-white/10 bg-[#0d0819] overflow-hidden aspect-square shadow-[0_30px_80px_-20px_rgba(91,61,245,0.45)]">
        <img
          src={heroVisual.url}
          alt="Genesis Hub"
          width={1024}
          height={1024}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
        className="absolute -left-4 top-16 hidden md:block"
      >
        <div className="rounded-xl bg-[#1D1638]/90 backdrop-blur border border-white/10 px-3 py-2 shadow-xl shadow-black/40">
          <div className="text-[10px] text-white/50">Uptime</div>
          <div className="text-sm font-semibold">99.9%</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
        className="absolute -right-4 bottom-20 hidden md:block"
      >
        <div className="rounded-xl bg-[#1D1638]/90 backdrop-blur border border-white/10 px-3 py-2 shadow-xl shadow-black/40">
          <div className="text-[10px] text-white/50">Entrega</div>
          <div className="text-sm font-semibold">24h auto</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
