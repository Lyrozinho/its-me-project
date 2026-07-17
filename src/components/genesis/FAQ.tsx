import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const FAQS = [
  {
    q: "Afinal, o que a Extensão Love Hyro faz?",
    a: "Ela congela o consumo de créditos dentro do seu navegador enquanto você usa a plataforma. Você trabalha normalmente, mas os créditos param de ser descontados durante a sessão ativa.",
  },
  {
    q: "Tem como instalar sem ser programador?",
    a: "Sim. A instalação é feita em poucos cliques, com um vídeo passo a passo. Não precisa mexer em código, terminal ou configuração avançada.",
  },
  {
    q: "Posso testar antes de pagar o plano maior?",
    a: "Pode. Recomendamos começar pelo plano de 1 dia para validar tudo na sua conta. Se gostar, é só evoluir para 3, 7, 15 ou 30 dias.",
  },
  {
    q: "Funciona no meu navegador?",
    a: "Funciona nos navegadores baseados em Chromium (Chrome, Brave, Edge e Opera). Basta ter a versão atualizada instalada no seu computador.",
  },
  {
    q: "Por que não está direto na Chrome Web Store?",
    a: "A extensão é distribuída de forma privada para manter o controle de qualidade, entregar atualizações rápidas e proteger o funcionamento contra bloqueios automáticos da loja.",
  },
  {
    q: "Vocês acessam a minha conta?",
    a: "Não. A extensão roda 100% localmente no seu navegador. Nenhuma senha, sessão ou dado da sua conta é enviado para os nossos servidores.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem garantia de satisfação. Se algo não corresponder ao prometido, entre em contato pelo suporte e resolvemos com prioridade, incluindo reembolso quando aplicável.",
  },
  {
    q: "Como funciona a entrega?",
    a: "É automática. Assim que o PIX é confirmado, a chave de ativação aparece na tela e chega no seu email na mesma hora, pronta para usar.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Tira-dúvidas direto ao ponto"
          title={
            <>
              As dúvidas que <span className="text-gradient">todo mundo manda</span>
            </>
          }
          description="Resposta curta, sem rodeio. 8 pontos para você decidir agora."
        />

        <div className="mt-14 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className={`relative rounded-xl border bg-white/[0.02] overflow-hidden transition-colors ${
                  isOpen ? "border-white/15" : "border-white/8 hover:border-white/12"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="relative w-full flex items-center gap-4 p-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-[11px] font-mono tracking-widest text-[#A78BFA]/70 tabular-nums">
                    {num}
                  </span>
                  <span className="flex-1 text-[15px] font-medium text-white/90 group-hover:text-white transition-colors">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid h-7 w-7 place-items-center rounded-full bg-white/5 border border-white/10 text-[#A78BFA]"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="relative"
                    >
                      <div className="px-5 pb-5 pl-[3.25rem] pr-14">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                        <p className="text-sm text-white/65 leading-relaxed">{f.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
