import { motion } from "framer-motion";
import { Zap, Lock, Infinity as InfinityIcon, Headphones, LineChart, Gem } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { GlassCard } from "./GlassCard";

const B = [
  { icon: Zap, title: "Entrega instantânea", desc: "Ativação automática após a compra, sem espera." },
  { icon: Lock, title: "Pagamento blindado", desc: "Criptografia ponta a ponta em cada transação." },
  { icon: InfinityIcon, title: "Atualizações contínuas", desc: "Novas versões liberadas para sua conta." },
  { icon: Headphones, title: "Suporte dedicado", desc: "Equipe humana pronta em minutos, todos os dias." },
  { icon: LineChart, title: "Métricas em tempo real", desc: "Acompanhe performance e receita ao vivo." },
  { icon: Gem, title: "Curadoria premium", desc: "Somente produtos aprovados pelo nosso time." },
];

export function Benefits() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Benefícios"
          title={<>Feito para times que exigem <span className="text-gradient">excelência</span></>}
          description="Cada detalhe pensado para acelerar sua operação sem abrir mão do requinte."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {B.map((b, i) => (
            <motion.div key={b.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#7A5CFF]/30 to-[#5B3DF5]/10 border border-white/10 grid place-items-center">
                  <b.icon className="h-5 w-5 text-[#A78BFA]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{b.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
