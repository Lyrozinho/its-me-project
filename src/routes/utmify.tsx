import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Save, PlugZap, ShieldCheck, Send, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Background } from "@/components/genesis/Background";
import { adminGetUtmifyConfig, adminSaveUtmifyConfig, adminTestUtmify } from "@/lib/utmify.functions";

export const Route = createFileRoute("/utmify")({
  head: () => ({
    meta: [
      { title: "Painel Utmify - Love Hyro" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Painel de integração Utmify." },
    ],
  }),
  component: UtmifyAdminPage,
});

type ConfigView = {
  hasToken: boolean;
  tokenPreview: string;
  platform: string;
  enabled: boolean;
  updatedAt: string | null;
};


function UtmifyAdminPage() {
  const [token, setToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [cfg, setCfg] = useState<ConfigView | null>(null);
  const [apiToken, setApiToken] = useState("");
  const [platform, setPlatform] = useState("LoveHyro");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const c = await adminGetUtmifyConfig({ data: { token: token.trim() } });
      setCfg(c);
      setPlatform(c.platform || "LoveHyro");
      setEnabled(c.enabled);
      setUnlocked(true);
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Falha ao autenticar" });
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setMsg(null);
    setLoading(true);
    try {
      await adminSaveUtmifyConfig({
        data: {
          token: token.trim(),
          api_token: apiToken.trim() || undefined,
          platform: platform.trim() || "LoveHyro",
          enabled,
        },
      });
      const c = await adminGetUtmifyConfig({ data: { token: token.trim() } });
      setCfg(c);
      setApiToken("");
      setMsg({ type: "ok", text: "Configuração salva." });
    } catch (err) {
      const t = err instanceof Error ? err.message : "Falha ao salvar";
      const hint = /relation.*does not exist|not found|schema cache|hyro_utmify_config/i.test(t)
        ? "A tabela hyro_utmify_config ainda não existe no Supabase Hyro. Rode o SQL abaixo primeiro."
        : t;
      setMsg({ type: "err", text: hint });
    } finally {
      setLoading(false);
    }
  };

  const test = async () => {
    setMsg(null);
    setTesting(true);
    try {
      const r = await adminTestUtmify({ data: { token: token.trim() } });
      if (r.ok) setMsg({ type: "ok", text: `Envio de teste OK (HTTP ${r.status ?? 200}).` });
      else setMsg({ type: "err", text: `Falhou: ${r.message ?? "erro desconhecido"}` });
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Falha no teste" });
    } finally {
      setTesting(false);
    }
  };


  return (
    <div className="dark relative min-h-screen text-white overflow-x-hidden">
      <Background />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-11 w-11 rounded-2xl grid place-items-center bg-gradient-to-br from-[#5B3DF5] to-[#7A5CFF] shadow-lg shadow-[#5B3DF5]/30">
            <PlugZap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Painel Utmify</h1>
            <p className="text-[13px] text-white/55">Integração de vendas (Love Hyro → Utmify)</p>
          </div>
        </motion.header>

        {!unlocked ? (
          <motion.form
            onSubmit={unlock}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8"
          >
            <label className="text-[11px] font-bold tracking-wider text-white/50 uppercase flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-[#A78BFA]" /> Token de acesso
            </label>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                autoFocus
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Digite o token"
                className="flex-1 h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#7A5CFF] focus:ring-2 focus:ring-[#7A5CFF]/30 outline-none text-[14px]"
              />
              <button
                type="submit"
                disabled={loading || !token}
                className="h-12 px-6 rounded-xl bg-[#5B3DF5] hover:bg-[#6a4cf7] disabled:opacity-60 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Entrar
              </button>
            </div>
            {msg && (
              <p className={`mt-4 text-[13px] ${msg.type === "err" ? "text-red-300" : "text-emerald-300"}`}>
                {msg.text}
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Status */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-white/50 uppercase">Status</div>
                  <div className="mt-1 flex items-center gap-2 text-[15px] font-semibold">
                    {cfg?.hasToken && cfg?.enabled ? (
                      <><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Ativo</>
                    ) : (
                      <><XCircle className="h-4 w-4 text-white/50" /> Inativo</>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold tracking-wider text-white/50 uppercase">Token atual</div>
                  <div className="mt-1 text-[13px] font-mono text-white/75">
                    {cfg?.tokenPreview || "não configurado"}
                  </div>
                </div>
              </div>
              {cfg?.updatedAt && (
                <p className="mt-3 text-[12px] text-white/45">
                  Última atualização: {new Date(cfg.updatedAt).toLocaleString("pt-BR")}
                </p>
              )}
            </section>

            {/* Config form */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-7 space-y-5">
              <h2 className="text-[15px] font-semibold">Credencial Utmify</h2>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-white/50 uppercase">
                  API Token (x-api-token)
                </label>
                <input
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder={cfg?.hasToken ? "•••• (mantém o atual se em branco)" : "cole aqui o token gerado na Utmify"}
                  className="mt-2 w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#7A5CFF] focus:ring-2 focus:ring-[#7A5CFF]/30 outline-none text-[14px] font-mono"
                />
                <p className="mt-2 text-[12px] text-white/50">
                  Gere em <span className="text-white/80">Utmify → Integrações → Webhooks → Credenciais de API</span>.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold tracking-wider text-white/50 uppercase">Nome da plataforma</label>
                  <input
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="LoveHyro"
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#7A5CFF] focus:ring-2 focus:ring-[#7A5CFF]/30 outline-none text-[14px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-wider text-white/50 uppercase">Envio automático</label>
                  <button
                    type="button"
                    onClick={() => setEnabled((v) => !v)}
                    className={`mt-2 w-full h-12 px-4 rounded-xl border text-[14px] font-semibold inline-flex items-center justify-between transition-colors ${
                      enabled
                        ? "bg-[#5B3DF5]/15 border-[#7A5CFF]/40 text-white"
                        : "bg-white/[0.04] border-white/10 text-white/70"
                    }`}
                  >
                    {enabled ? "Ativado" : "Desativado"}
                    <span className={`h-6 w-11 rounded-full relative transition-colors ${enabled ? "bg-[#5B3DF5]" : "bg-white/15"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={save}
                  disabled={loading}
                  className="h-11 px-5 rounded-xl bg-[#5B3DF5] hover:bg-[#6a4cf7] disabled:opacity-60 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Salvar configuração
                </button>
                <button
                  type="button"
                  onClick={test}
                  disabled={testing || !cfg?.hasToken}
                  title={!cfg?.hasToken ? "Salve o token antes de testar" : "Envia um pedido de teste (isTest=true)"}
                  className="h-11 px-5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-50 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Enviar teste
                </button>
              </div>

              {msg && (
                <p className={`text-[13px] ${msg.type === "err" ? "text-red-300" : msg.type === "ok" ? "text-emerald-300" : "text-white/70"}`}>
                  {msg.text}
                </p>
              )}
            </section>

            {/* Eventos disparados */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-7">
              <h2 className="text-[15px] font-semibold mb-3">Eventos enviados automaticamente</h2>
              <ul className="space-y-2 text-[13px] text-white/75">
                <li className="flex gap-2"><span className="text-[#A78BFA]">•</span> <b>PIX gerado</b> → status <code className="text-white/90">waiting_payment</code></li>
                <li className="flex gap-2"><span className="text-[#A78BFA]">•</span> <b>PIX pago</b> → status <code className="text-white/90">paid</code></li>
                <li className="flex gap-2"><span className="text-[#A78BFA]">•</span> <b>Cartão aprovado</b> → status <code className="text-white/90">paid</code> (paymentMethod: credit_card)</li>
              </ul>
              <p className="mt-4 text-[12px] text-white/45">
                Endpoint destino: <code className="text-white/70">POST https://api.utmify.com.br/api-credentials/orders</code>
              </p>
            </section>

            {/* Setup DB */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-7">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-[#A78BFA]" />
                <h2 className="text-[15px] font-semibold">Setup inicial (executar 1 vez no Supabase Hyro)</h2>
              </div>
              <p className="text-[12px] text-white/55 mb-3">
                Cole este SQL em <b>SQL Editor</b> se aparecer erro de tabela inexistente ao salvar.
              </p>
              <pre className="rounded-xl bg-black/40 border border-white/10 p-4 text-[11px] leading-relaxed overflow-x-auto text-white/85 font-mono">
{SQL_SETUP}
              </pre>
              <button
                type="button"
                onClick={copySql}
                className="mt-3 h-9 px-4 rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-[12px] font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copiado!" : "Copiar SQL"}
              </button>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
