import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const FAQS = [
  { q: "Como recebo meu produto após a compra?", a: "A ativação é imediata. Assim que o pagamento é confirmado, o produto aparece automaticamente na sua conta Genesis." },
  { q: "Existe algum tipo de garantia?", a: "Sim. Todos os produtos possuem garantia de satisfação. Caso algo não corresponda ao esperado, oferecemos suporte prioritário e reembolso." },
  { q: "Posso revender os produtos?", a: "Sim. Nosso programa de revenda é aberto e oferece condições especiais para parceiros credenciados." },
  { q: "Quais métodos de pagamento são aceitos?", a: "Aceitamos cartão de crédito, PIX, boleto e carteiras digitais, tudo com criptografia de ponta a ponta." },
  { q: "Como funciona o suporte?", a: "Nossa equipe está disponível todos os dias, com resposta média em minutos via chat e email." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Perguntas frequentes"
          title={<>Dúvidas <span className="text-gradient">comuns</span></>}
        />
        <div className="mt-14 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="relative rounded-2xl glass overflow-hidden">
                <div className="gradient-border-inner rounded-2xl" />
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <span className="flex-1 text-[15px] font-medium">{f.q}</span>
                  <motion.div animate={{ rotate: isOpen ? 45 : 0 }}>
                    <Plus className="h-5 w-5 text-[#A78BFA]" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed max-w-3xl">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
