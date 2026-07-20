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
  PlayCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Background } from "@/components/genesis/Background";
import { Navbar } from "@/components/genesis/Navbar";
import { validateLicense } from "@/lib/hyro-validate.functions";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Baixar extensão - Love Hyro" },
      { name: "description", content: "Baixe a extensão Love Hyro validando sua chave de licença." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadPage,
});

const EXT_URL = "/love-hyro-extension.zip";

function DownloadPage() {
  const validate = useServerFn(validateLicense);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<{ planLabel?: string; expiresAt?: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const trimmed = key.trim();
    if (!trimmed) {
      setError("Digite sua chave.");
      return;
    }
    setLoading(true);
    try {
      const res = await validate({ data: { key: trimmed } });
      if (!res.valid) {
        setError(res.reason || "Chave inválida.");
      } else {
        setOk({ planLabel: res.planLabel, expiresAt: res.expiresAt });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao validar.");
    } finally {
      setLoading(false);
    }
  }

  function downloadZip() {
    fetch(EXT_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Falha ao baixar (${r.status})`);
        return r.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "love-hyro-extension.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((e) => setError(e.message));
  }

  const expiresLabel = ok?.expiresAt
    ? new Date(ok.expiresAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : null;

  return (
    <div className="dark relative min-h-screen text-white overflow-x-hidden">
      <Background />
      <Navbar />

      <main className="relative pt-28 sm:pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <DownloadIcon className="h-5 w-5 text-[#A78BFA]" />
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-[-0.03em] leading-[1.05]">
              Baixar a <span className="text-gradient">extensão</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-white/55 leading-relaxed">
              Valide sua chave de licença para liberar o download da extensão Love Hyro.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-8 sm:mt-10 relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0A1E]/80 backdrop-blur-xl p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(122,92,255,0.18),transparent_65%)] blur-2xl" />
            </div>

            <form onSubmit={onSubmit} className="relative">
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/50 mb-2">
                Chave da licença
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Ex: A7K-9F3B-XM2-QP4"
                  disabled={loading || !!ok}
                  className="w-full h-12 pl-10 pr-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7A5CFF]/60 focus:bg-white/[0.06] transition-colors disabled:opacity-60"
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

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {!ok ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#5B3DF5] hover:bg-[#6a4cf7] px-5 text-sm font-semibold text-white transition-colors shadow-[0_8px_24px_-12px_rgba(122,92,255,0.7)] disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Validando...
                      </>
                    ) : (
                      <>
                        Validar chave
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={downloadZip}
                    className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white text-[#0B0715] hover:bg-white/90 px-5 text-sm font-semibold transition-colors"
                  >
                    <DownloadIcon className="h-4 w-4" /> Baixar extensão
                  </button>
                )}

                <Link
                  to="/"
                  hash="tutorial"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] px-5 text-sm font-semibold text-white/90 transition-colors"
                >
                  <PlayCircle className="h-4 w-4 text-[#A78BFA]" /> Como instalar
                </Link>
              </div>

              <div className="mt-6 flex items-start gap-2 text-[12px] text-white/50 leading-relaxed">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-[#A78BFA]" />
                <span>
                  A validação é feita em tempo real. O download só é liberado para chaves ativas e dentro do prazo.
                </span>
              </div>
            </form>
          </motion.div>

          {ok && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/70"
            >
              <p className="font-semibold text-white mb-2">Depois de baixar:</p>
              <ol className="list-decimal list-inside space-y-1 text-white/60">
                <li>Descompacte o arquivo <span className="text-white/80">love-hyro-extension.zip</span>.</li>
                <li>Abra <span className="text-white/80">chrome://extensions</span> no navegador.</li>
                <li>Ative o <span className="text-white/80">Modo do desenvolvedor</span>.</li>
                <li>Clique em <span className="text-white/80">Carregar sem compactação</span> e selecione a pasta.</li>
              </ol>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
