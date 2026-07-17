import { motion } from "framer-motion";
import { Package, Rocket, Code2, Palette, Bot, Cloud, Shield, Layers } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { GlassCard } from "./GlassCard";

const CATS = [
  { icon: Rocket, name: "Lançamentos", count: 128 },
  { icon: Code2, name: "Desenvolvimento", count: 312 },
  { icon: Palette, name: "Design", count: 204 },
  { icon: Bot, name: "Automação", count: 96 },
  { icon: Cloud, name: "Infraestrutura", count: 71 },
  { icon: Shield, name: "Segurança", count: 58 },
  { icon: Layers, name: "Templates", count: 260 },
  { icon: Package, name: "Bundles", count: 42 },
];

export function Categories() {
  return (
    <section id="categorias" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Categorias"
          title={<>Explore por <span className="text-gradient">categoria</span></>}
          description="Descubra produtos organizados por área. Cada categoria é curada para entregar apenas o essencial."
        />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATS.map((c, i) => (
            <motion.div key={c.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <GlassCard className="p-5">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#7A5CFF]/30 to-[#5B3DF5]/10 border border-white/10 grid place-items-center">
                  <c.icon className="h-5 w-5 text-[#A78BFA]" />
                </div>
                <div className="mt-4 text-[15px] font-semibold">{c.name}</div>
                <div className="mt-1 text-xs text-white/50">{c.count} produtos</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
