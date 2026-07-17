import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { GlassCard } from "./GlassCard";

const T = [
  { name: "Marina Costa", role: "CEO, Northwave", text: "Migramos toda a operação para o Genesis. A qualidade dos produtos e o suporte são absurdos." },
  { name: "Rafael Duarte", role: "CTO, Halo Digital", text: "Nunca vi um catálogo tão bem curado. Cada compra é uma experiência premium do início ao fim." },
  { name: "Julia Andrade", role: "Fundadora, Métrica", text: "Automatizamos 80% dos processos em duas semanas. Simplesmente incomparável." },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Depoimentos"
          title={<>O que dizem os <span className="text-gradient">clientes</span></>}
        />
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {T.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <GlassCard>
                <div className="flex gap-0.5 text-[#A78BFA]">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-5 text-[15px] text-white/80 leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] grid place-items-center text-sm font-semibold">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-white/50">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
