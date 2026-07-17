import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { GlassCard } from "./GlassCard";

const PRODUCTS = [
  { name: "Genesis Analytics Pro", desc: "Dashboards em tempo real com insights preditivos.", price: 249, old: 349, tag: "Novo", grad: "from-[#5B3DF5] to-[#A78BFA]" },
  { name: "Automation Suite", desc: "Fluxos automatizados sem código para times enxutos.", price: 189, tag: "-40%", grad: "from-[#7A5CFF] to-[#131024]" },
  { name: "Growth Toolkit", desc: "Kit completo com landing, CRM e integrações prontas.", price: 129, old: 199, tag: "Popular", grad: "from-[#A78BFA] to-[#5B3DF5]" },
  { name: "Vault Security", desc: "Camada de proteção enterprise para APIs e dados.", price: 299, tag: "Pro", grad: "from-[#1D1638] to-[#7A5CFF]" },
  { name: "Studio Templates", desc: "Coleção premium de templates responsivos.", price: 79, old: 149, tag: "-47%", grad: "from-[#5B3DF5] to-[#1D1638]" },
  { name: "AI Copilot", desc: "Assistente inteligente treinado no seu produto.", price: 219, tag: "IA", grad: "from-[#A78BFA] to-[#131024]" },
];

export function FeaturedProducts() {
  return (
    <section id="produtos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            align="left"
            eyebrow="Em destaque"
            title={<>Produtos <span className="text-gradient">selecionados</span></>}
            description="Curadoria de ferramentas premium usadas por milhares de times."
          />
          <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Ver todos →</a>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <GlassCard className="p-0 overflow-hidden">
                {/* Visual */}
                <div className={`relative h-52 bg-gradient-to-br ${p.grad} overflow-hidden`}>
                  <div className="absolute inset-0 grid-tech opacity-40" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_50%)]" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white border border-white/20">
                      {p.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-xl glass-strong p-3 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-300" />
                      <div className="text-[11px] text-white/80">Disponível agora</div>
                      <div className="ml-auto flex items-center gap-1 text-[11px] text-white/70">
                        <Star className="h-3 w-3 fill-[#A78BFA] text-[#A78BFA]" /> 4.9
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="text-[17px] font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{p.desc}</p>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      {p.old && <div className="text-xs text-white/40 line-through">R$ {p.old}</div>}
                      <div className="text-2xl font-semibold tracking-tight">
                        R$ <span className="text-gradient">{p.price}</span>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] shadow-[0_10px_30px_-10px_rgba(91,61,245,0.7)] hover:brightness-110 transition-all">
                      <ShoppingBag className="h-4 w-4" /> Comprar
                    </button>
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
