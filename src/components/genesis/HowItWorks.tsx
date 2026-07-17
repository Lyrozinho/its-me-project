import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const STEPS = [
  { n: "01", title: "Escolha seu produto", desc: "Navegue pela curadoria e selecione a solução perfeita." },
  { n: "02", title: "Pague com segurança", desc: "Checkout blindado com múltiplos métodos e criptografia." },
  { n: "03", title: "Ative em segundos", desc: "Acesso liberado automaticamente na sua conta Genesis." },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Como funciona"
          title={<>Três passos até o <span className="text-gradient">upgrade</span></>}
        />
        <div className="mt-16 grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#7A5CFF]/40 to-transparent" />
          {STEPS.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto relative h-20 w-20 rounded-full glass-strong grid place-items-center glow-violet">
                <span className="text-lg font-semibold text-gradient">{s.n}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
