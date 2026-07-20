import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Key, Copy, Check, Loader2, Gift, ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { issueTrialLicense, type TrialLicense } from "@/lib/hyro-trial.functions";

export function TrialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const issue = useServerFn(issueTrialLicense);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<TrialLicense | null>(null);
  const [copied, setCopied] = useState<"key" | "pass" | null>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setName(""); setEmail(""); setPhone("");
        setErr(null); setResult(null); setLoading(false); setCopied(null);
      }, 200);
    }
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const r = await issue({ data: { name, email, phone } });
      setResult(r);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Falha ao gerar teste");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string, which: "key" | "pass") {
    try { await navigator.clipboard.writeText(text); setCopied(which); setTimeout(() => setCopied(null), 1500); } catch {}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] grid place-items-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#131024] p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-3 top-3 h-8 w-8 grid place-items-center rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {!result ? (
              <>
                <div className="h-12 w-12 rounded-xl bg-[#5B3DF5]/15 border border-[#7A5CFF]/25 grid place-items-center">
                  <Gift className="h-5 w-5 text-[#A78BFA]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Teste grátis por 10 minutos</h3>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">
                  Preencha seus dados e receba na hora sua chave para testar a extensão. Limite de 1 teste por e-mail.
                </p>

                <form onSubmit={onSubmit} className="mt-5 space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/50">Nome completo</label>
                    <input
                      required minLength={2} value={name} onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-sm outline-none focus:border-[#7A5CFF] transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/50">E-mail</label>
                    <input
                      required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-sm outline-none focus:border-[#7A5CFF] transition-colors"
                      placeholder="voce@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/50">WhatsApp <span className="text-white/30 normal-case">(opcional)</span></label>
                    <input
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-sm outline-none focus:border-[#7A5CFF] transition-colors"
                      placeholder="(11) 90000-0000"
                    />
                  </div>

                  {err && (
                    <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                      {err}
                    </div>
                  )}

                  <button
                    type="submit" disabled={loading}
                    className="mt-1 w-full h-12 rounded-full bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(91,61,245,0.9)] hover:brightness-110 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  >
                    {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Gerando...</>) : (<>Gerar minha chave grátis</>)}
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/45">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#A78BFA]" /> Ativação imediata • Sem cartão
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-xl bg-emerald-400/15 border border-emerald-400/30 grid place-items-center">
                  <Key className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Sua chave grátis está pronta</h3>
                <p className="mt-1.5 text-sm text-white/60">
                  {result.planLabel}. Válida até <span className="text-white/85">{new Date(result.expiresAt).toLocaleString("pt-BR")}</span>.
                </p>

                <div className="mt-5 space-y-3">
                  <Field label="Chave de licença" value={result.licenseKey} copied={copied === "key"} onCopy={() => copy(result.licenseKey, "key")} />
                  <Field label="Senha" value={result.password} copied={copied === "pass"} onCopy={() => copy(result.password, "pass")} />
                  <Field label="E-mail" value={result.email} />
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-white/50">
                  <Clock className="h-3.5 w-3.5 text-[#A78BFA]" /> Copie e ative agora na extensão. Após 10 min a chave expira.
                </div>

                <button
                  onClick={onClose}
                  className="mt-5 w-full h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-sm font-medium transition"
                >
                  Fechar
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value, copied, onCopy }: { label: string; value: string; copied?: boolean; onCopy?: () => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/45">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 truncate text-sm font-mono text-white">{value}</code>
        {onCopy && (
          <button onClick={onCopy} className="h-8 w-8 grid place-items-center rounded-lg bg-white/[0.06] hover:bg-white/10 transition" aria-label="Copiar">
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4 text-white/70" />}
          </button>
        )}
      </div>
    </div>
  );
}
