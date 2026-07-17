import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="revenda" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] glass-strong p-10 sm:p-16 text-center glow-violet"
        >
          <div className="gradient-border-inner rounded-[2rem]" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(122,92,255,0.45),transparent_60%)] blur-2xl" />
          <div className="absolute inset-0 grid-tech opacity-30" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-[#A78BFA]">
              Pronto para começar
            </div>
            <h2 className="mt-6 text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
              O próximo nível do seu <span className="text-gradient">negócio digital</span> começa aqui.
            </h2>
            <p className="mt-5 text-white/60 max-w-xl mx-auto">
              Junte-se a milhares de empresas que já operam com o Genesis Hub.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button className="group h-12 px-6 rounded-full text-sm font-medium text-white bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] shadow-[0_20px_50px_-15px_rgba(91,61,245,0.8)] hover:brightness-110 transition-all inline-flex items-center gap-2">
                Criar minha conta <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="h-12 px-6 rounded-full text-sm font-medium glass hover:bg-white/10 transition-colors">
                Falar com vendas
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
