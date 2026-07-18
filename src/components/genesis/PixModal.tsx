import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, Loader2, CheckCircle2, AlertCircle, Minus } from "lucide-react";
import { PixIcon } from "./PixIcon";
import { formatBRL } from "@/lib/plans";
import { getPixStatus } from "@/lib/checkout.functions";
import { clearActiveCharge, updateActiveCharge } from "@/lib/pix-store";

type Charge = {
  id: string;
  qrCodeBase64: string | null;
  qrCodeText: string | null;
  expiresAt: string | null;
  amount: number;
};

type Status = "pending" | "paid" | "expired" | "error";

const EXPIRY_MS = 5 * 60 * 1000;

function normalize(s: string): Status {
  const v = s.toLowerCase();
  if (["paid", "approved", "completed", "confirmed"].includes(v)) return "paid";
  if (["expired", "canceled", "cancelled", "failed"].includes(v)) return "expired";
  return "pending";
}

export function PixModal({ charge, onClose, onMinimize }: { charge: Charge; onClose: () => void; onMinimize?: () => void }) {

  const deadline = useMemo(() => {
    const remote = charge.expiresAt ? new Date(charge.expiresAt).getTime() : NaN;
    const fromRemote = Number.isFinite(remote) ? remote : 0;
    const fallback = Date.now() + EXPIRY_MS;
    // Prefer remote when it's within a reasonable window, else fallback to 5 min.
    return fromRemote > Date.now() && fromRemote - Date.now() <= EXPIRY_MS + 60_000 ? fromRemote : fallback;
  }, [charge.expiresAt]);

  const [now, setNow] = useState(Date.now());
  const [status, setStatus] = useState<Status>("pending");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<number | null>(null);

  const remaining = Math.max(0, deadline - now);
  const totalMs = EXPIRY_MS;
  const progress = Math.max(0, Math.min(1, remaining / totalMs));
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (status !== "pending") return;
    if (remaining <= 0) {
      setStatus("expired");
      clearActiveCharge();
    }
  }, [remaining, status]);

  useEffect(() => {
    if (!charge.id || status !== "pending") return;
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await getPixStatus({ data: { id: charge.id } });
        if (cancelled) return;
        const s = normalize(r.status || "");
        if (s !== "pending") {
          setStatus(s);
          if (s === "paid") updateActiveCharge({ status: "paid" });
          clearActiveCharge();
        }
      } catch { /* silently retry */ }
    };
    pollRef.current = window.setInterval(tick, 4000);
    tick();
    return () => {
      cancelled = true;
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [charge.id, status]);

  const minimize = onMinimize ?? onClose;

  const closeAndDiscard = () => {
    clearActiveCharge();
    onClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") minimize(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [minimize]);


  const copy = async () => {
    if (!charge.qrCodeText) return;
    try {
      await navigator.clipboard.writeText(charge.qrCodeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] grid place-items-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
        onClick={minimize}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#120C24]/95 backdrop-blur-xl shadow-[0_30px_100px_-30px_rgba(91,61,245,0.6)] overflow-hidden max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {status === "pending" && (
              <button
                onClick={minimize}
                aria-label="Minimizar"
                title="Minimizar (o Pix continua ativo)"
                className="h-9 w-9 grid place-items-center rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={status === "pending" ? minimize : closeAndDiscard}
              aria-label="Fechar"
              className="h-9 w-9 grid place-items-center rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3 pr-20">
              <div className="h-11 w-11 rounded-2xl bg-white grid place-items-center shrink-0">
                <PixIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Pagamento via Pix</div>
                <div className="text-lg font-black tracking-tight">{formatBRL(charge.amount)}</div>
              </div>
            </div>

            {status === "paid" ? (
              <SuccessState amount={charge.amount} onClose={closeAndDiscard} />
            ) : status === "expired" ? (
              <ExpiredState onClose={closeAndDiscard} />
            ) : (

              <>
                {/* Timer */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-white/60">
                    <span>Tempo restante</span>
                    <span className="font-mono text-white tabular-nums">{mm}:{ss}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7A5CFF] to-[#5B3DF5] transition-[width] duration-300 ease-linear"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>

                {/* QR */}
                <div className="mt-5 flex justify-center">
                  <div className="rounded-2xl bg-white p-4 shadow-[0_10px_40px_-15px_rgba(122,92,255,0.35)] ring-1 ring-white/10">
                    {charge.qrCodeBase64 ? (
                      <img
                        src={charge.qrCodeBase64.startsWith("data:") ? charge.qrCodeBase64 : `data:image/png;base64,${charge.qrCodeBase64}`}
                        alt="QR Code PIX"
                        width={200}
                        height={200}
                        className="h-[200px] w-[200px] block object-contain"
                      />
                    ) : (
                      <div className="h-[200px] w-[200px] grid place-items-center text-black/60 text-xs">
                        QR indisponível
                      </div>
                    )}
                  </div>
                </div>



                <p className="mt-4 text-[12.5px] text-white/60 text-center leading-relaxed">
                  Abra o app do seu banco, escaneie o QR Code ou use o código Pix copia e cola abaixo.
                </p>

                {/* Copy paste */}
                <div className="mt-3">
                  <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase mb-1.5">Pix copia e cola</div>
                  <div className="flex items-stretch gap-2">
                    <input
                      readOnly
                      value={charge.qrCodeText || ""}
                      onFocus={(e) => e.currentTarget.select()}
                      className="flex-1 min-w-0 h-11 rounded-xl bg-white/[0.03] border border-white/10 px-3 text-[12px] font-mono text-white/85 truncate outline-none focus:border-[#7A5CFF]/50"
                    />
                    <button
                      onClick={copy}
                      disabled={!charge.qrCodeText}
                      className="shrink-0 h-11 px-3 rounded-xl bg-[#5B3DF5]/90 hover:bg-[#5B3DF5] border border-white/10 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {copied ? <><Check className="h-4 w-4" /> Copiado</> : <><Copy className="h-4 w-4" /> Copiar</>}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-[11.5px] text-white/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#A78BFA]" />
                  Aguardando confirmação do pagamento...
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SuccessState({ amount, onClose }: { amount: number; onClose: () => void }) {
  return (
    <div className="mt-6 text-center py-4">
      <div className="mx-auto h-14 w-14 rounded-full grid place-items-center bg-emerald-500/15 border border-emerald-400/30">
        <CheckCircle2 className="h-7 w-7 text-emerald-300" />
      </div>
      <h3 className="mt-4 text-xl font-black">Pagamento confirmado</h3>
      <p className="mt-2 text-[13px] text-white/60">
        Recebemos {formatBRL(amount)}. Sua extensão será liberada em instantes.
      </p>
      <button
        onClick={onClose}
        className="mt-6 h-11 px-5 rounded-xl bg-[#5B3DF5]/90 hover:bg-[#5B3DF5] border border-white/10 text-white text-[13px] font-semibold"
      >
        Concluir
      </button>
    </div>
  );
}

function ExpiredState({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-6 text-center py-4">
      <div className="mx-auto h-14 w-14 rounded-full grid place-items-center bg-white/[0.04] border border-white/10">
        <AlertCircle className="h-7 w-7 text-[#A78BFA]" />
      </div>
      <h3 className="mt-4 text-xl font-black">Pix expirado</h3>
      <p className="mt-2 text-[13px] text-white/60">
        O tempo para pagamento acabou. Gere um novo Pix para continuar.
      </p>
      <button
        onClick={onClose}
        className="mt-6 h-11 px-5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-[13px] font-semibold"
      >
        Fechar
      </button>
    </div>
  );
}
