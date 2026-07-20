import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download as DownloadIcon,
  KeyRound,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  Puzzle,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Background } from "@/components/genesis/Background";
import { validateLicense } from "@/lib/hyro-validate.functions";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Baixar Extensão - Love Hyro" },
      { name: "description", content: "Baixe a extensão Love Hyro validando sua chave de licença ou chave teste." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadPage,
});

const EXT_URL = "/love-hyro-extension.zip";
const WHATSAPP_URL = "https://wa.me/5511999999999";

function DownloadPage() {
  const validate = useServerFn(validateLicense);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<{ planLabel?: string; expiresAt?: string } | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleClick() {
    setError(null);
    const trimmed = key.trim();
    if (!trimmed) {
      setError("Digite sua chave de licença ou chave teste.");
      return;
    }

    if (!ok) {
      setLoading(true);
      try {
        const res = await validate({ data: { key: trimmed } });
        if (!res.valid) {
          setError(res.reason || "Chave inválida.");
          setLoading(false);
          return;
        }
        setOk({ planLabel: res.planLabel, expiresAt: res.expiresAt });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao validar.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    setDownloading(true);
    try {
      const r = await fetch(EXT_URL);
      if (!r.ok) throw new Error(`Falha ao baixar (${r.status})`);
      const blob = await r.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "love-hyro-extension.zip";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no download");
    } finally {
      setDownloading(false);
    }
  }

  const expiresLabel = ok?.expiresAt
    ? new Date(ok.expiresAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : null;

  const steps = [
    { n: 1, text: <>Descompacte o arquivo <span className="text-white">ZIP</span> baixado.</> },
    { n: 2, text: <>Abra <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-[#A78BFA]">chrome://extensions</code></> },
    { n: 3, text: <>Ative o <span className="text-white">Modo do desenvolvedor</span>.</> },
    { n: 4, text: <>Clique em <span className="text-white">Carregar sem compactação</span> e selecione a pasta.</> },
    { n: 5, text: <>Pronto! Faça login com sua licença.</> },
  ];

  return (
    <div className="dark relative min-h-screen text-white overflow-x-hidden">
      <Background />

      {/* Slim header */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] shadow-[0_8px_24px_-8px_rgba(122,92,255,0.7)]">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Love Hyro</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </header>

      <main className="relative pb-24 pt-6 sm:pt-10">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] leading-[1.02]">
              Baixar Extensão{" "}
              <span className="bg-gradient-to-r from-white via-[#C9B8FF] to-[#7A5CFF] bg-clip-text text-transparent">
                Love Hyro
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-white/55 leading-relaxed">
              Insira sua chave de licença ou chave teste para liberar o download da extensão.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="mt-10 sm:mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            {/* Activation card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0A1E]/85 backdrop-blur-xl p-6 sm:p-8"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(122,92,255,0.22),transparent_65%)] blur-2xl" />

              <div className="relative flex items-start gap-3.5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#7A5CFF]/30 bg-[#5B3DF5]/15">
                  <KeyRound className="h-5 w-5 text-[#A78BFA]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Ativar download</h2>
                  <p className="mt-0.5 text-[13px] text-white/55">Liberado apenas para chaves válidas.</p>
                </div>
              </div>

              <div className="relative mt-6">
                <label className="block text-[12px] font-medium text-white/70 mb-2">
                  Chave de licença ou chave teste <span className="text-[#A78BFA]">*</span>
                </label>
                <div className="relative">
                  <input
                    value={key}
                    onChange={(e) => { setKey(e.target.value); if (ok) setOk(null); }}
                    placeholder="HYRO-XXXX-XXXX-XXXX  ou  TESTE-XXXX"
                    disabled={loading || downloading}
                    className="w-full h-14 px-4 rounded-2xl bg-black/40 border border-white/10 text-[15px] font-mono tracking-wider text-white placeholder:text-white/25 focus:outline-none focus:border-[#7A5CFF]/60 focus:bg-black/50 transition-colors disabled:opacity-60"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  {ok && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        Chave válida{ok.planLabel ? ` - ${ok.planLabel}` : ""}
                        {expiresLabel ? ` - expira em ${expiresLabel}` : ""}.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={handleClick}
                  disabled={loading || downloading}
                  className="group relative mt-5 w-full h-14 overflow-hidden rounded-2xl bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] text-[15px] font-semibold text-white shadow-[0_14px_38px_-14px_rgba(122,92,255,0.9)] transition hover:brightness-110 disabled:opacity-70 inline-flex items-center justify-center gap-2.5"
                >
                  <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
                  {loading ? (
                    <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Validando chave...</>
                  ) : downloading ? (
                    <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Preparando download...</>
                  ) : (
                    <><DownloadIcon className="h-4.5 w-4.5" /> Baixar Extensão (.zip)</>
                  )}
                </button>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-[13px] text-white/55">Ainda não tem chave de ativação?</span>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 text-[13px] font-semibold text-[#4ade80] hover:bg-[#22c55e]/20 transition"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Feature cards */}
            <div className="grid gap-4 content-start">
              {[
                {
                  icon: Zap,
                  title: "Sempre atualizada",
                  desc: "Você baixa direto a última versão estável.",
                },
                {
                  icon: Puzzle,
                  title: "Funciona em Chrome, Edge e Brave",
                  desc: "Instalação rápida em modo desenvolvedor.",
                },
                {
                  icon: Lock,
                  title: "Ativação segura",
                  desc: "Validação em tempo real da sua chave.",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0A1E]/70 backdrop-blur-xl p-5 hover:border-[#7A5CFF]/30 transition-colors"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(122,92,255,0.18),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-3.5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#7A5CFF]/25 bg-[#5B3DF5]/10">
                      <Icon className="h-4.5 w-4.5 text-[#A78BFA]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[14.5px] font-semibold tracking-tight">{title}</h3>
                      <p className="mt-1 text-[12.5px] text-white/55 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Como instalar */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0A1E]/70 backdrop-blur-xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-3.5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#7A5CFF]/30 bg-[#5B3DF5]/15">
                <Puzzle className="h-5 w-5 text-[#A78BFA]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Como instalar</h2>
                <p className="mt-0.5 text-[13px] text-white/55 inline-flex items-center gap-1.5">
                  5 passos rápidos <span className="text-white/25">-</span> leva menos de 1 minuto
                  <RefreshCw className="h-3.5 w-3.5 text-white/30" />
                </p>
              </div>
            </div>

            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-4 pt-6 hover:border-[#7A5CFF]/30 transition-colors"
                >
                  <span className="absolute -top-3 left-4 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] text-[12px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(122,92,255,0.9)]">
                    {s.n}
                  </span>
                  <p className="text-[13px] text-white/65 leading-relaxed">{s.text}</p>
                </motion.li>
              ))}
            </ol>

            <div className="mt-6 flex items-start gap-2 text-[12px] text-white/45 leading-relaxed">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-[#A78BFA]" />
              <span>Compatível com todos os navegadores baseados em Chromium. Sua chave é validada em tempo real.</span>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
