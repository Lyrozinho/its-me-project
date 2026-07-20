import { useEffect, useRef, useState } from "react";
import { CreditCard, User as UserIcon, Calendar, Lock, Loader2 } from "lucide-react";
import { MP_PUBLIC_KEY } from "@/lib/mp-config";
import { BrandIcon } from "./BrandIcons";
import { detectBrand, maskCardNumber, maskExpiry, maskCVV, validCardNumber, validExpiry, type CardBrand } from "@/lib/card";

// Minimal ambient typing for the Mercado Pago v2 SDK loaded from CDN.
declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, opts?: { locale?: string }) => MPInstance;
  }
}
type MPInstance = {
  createCardToken: (payload: {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }) => Promise<{ id: string }>;
  getPaymentMethods: (opts: { bin: string }) => Promise<{ results: Array<{ id: string; issuer?: { id: string | number } }> }>;
};

const SDK_SRC = "https://sdk.mercadopago.com/js/v2";

let sdkPromise: Promise<MPInstance> | null = null;
function loadMp(): Promise<MPInstance> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Sem window"));
    if (window.MercadoPago) return resolve(new window.MercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" }));
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_SRC}"]`);
    const script = existing ?? Object.assign(document.createElement("script"), { src: SDK_SRC, async: true });
    script.addEventListener("load", () => {
      if (!window.MercadoPago) return reject(new Error("SDK Mercado Pago não carregou"));
      resolve(new window.MercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" }));
    });
    script.addEventListener("error", () => reject(new Error("Falha ao carregar SDK Mercado Pago")));
    if (!existing) document.head.appendChild(script);
  });
  return sdkPromise;
}

export type TokenizedCard = {
  token: string;
  paymentMethodId: string;
  issuerId?: string;
};

export function CardForm({
  cpf,
  onTokenize,
  submitting,
  submitLabel,
  disabled,
}: {
  cpf: string;
  onTokenize: (card: TokenizedCard) => Promise<void> | void;
  submitting: boolean;
  submitLabel: string;
  disabled?: boolean;
}) {
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const brandCacheRef = useRef<string>("");

  // Preload SDK when the form mounts so click-to-pay feels instant.
  useEffect(() => { loadMp().catch(() => { /* handled at submit */ }); }, []);

  const digits = number.replace(/\D/g, "");
  const brand: CardBrand = detectBrand(digits);

  const canSubmit =
    !disabled && !busy && !submitting &&
    validCardNumber(digits) &&
    holder.trim().length >= 3 &&
    validExpiry(expiry) &&
    (cvv.length === 3 || (brand === "amex" && cvv.length === 4));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;
    setBusy(true);
    try {
      const mp = await loadMp();
      const bin = digits.slice(0, 8) || digits;

      let paymentMethodId = "";
      let issuerId: string | undefined;
      if (brandCacheRef.current.startsWith(`${bin}:`)) {
        const parts = brandCacheRef.current.split(":");
        paymentMethodId = parts[1] ?? "";
        issuerId = parts[2] || undefined;
      } else {
        const pm = await mp.getPaymentMethods({ bin });
        if (!pm.results?.length) throw new Error("Bandeira não aceita");
        paymentMethodId = pm.results[0].id;
        issuerId = pm.results[0].issuer?.id != null ? String(pm.results[0].issuer.id) : undefined;
        brandCacheRef.current = `${bin}:${paymentMethodId}:${issuerId ?? ""}`;
      }

      const [mm, yy] = expiry.split("/");
      const tok = await mp.createCardToken({
        cardNumber: digits,
        cardholderName: holder.trim(),
        cardExpirationMonth: mm,
        cardExpirationYear: `20${yy}`,
        securityCode: cvv,
        identificationType: "CPF",
        identificationNumber: cpf.replace(/\D/g, ""),
      });

      await onTokenize({ token: tok.id, paymentMethodId, issuerId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao processar cartão";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <div className="mb-1.5 text-[11px] font-bold tracking-wider text-white/60 uppercase">Número do cartão</div>
        <div className="relative">
          <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            required
            inputMode="numeric"
            autoComplete="cc-number"
            disabled={disabled}
            value={number}
            onChange={(e) => setNumber(maskCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
            className="input"
          />
          {brand !== "unknown" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-10 rounded-md bg-white ring-1 ring-black/5 grid place-items-center">
              <BrandIcon brand={brand} className="h-4 w-7" />
            </div>
          )}
        </div>
      </label>

      <label className="block">
        <div className="mb-1.5 text-[11px] font-bold tracking-wider text-white/60 uppercase">Nome impresso no cartão</div>
        <div className="relative">
          <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            required
            autoComplete="cc-name"
            disabled={disabled}
            value={holder}
            onChange={(e) => setHolder(e.target.value.replace(/[^A-Za-zÀ-ÿ ]/g, "").toUpperCase())}
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            className="input"
          />
        </div>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <div className="mb-1.5 text-[11px] font-bold tracking-wider text-white/60 uppercase">Validade</div>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              required
              inputMode="numeric"
              autoComplete="cc-exp"
              disabled={disabled}
              value={expiry}
              onChange={(e) => setExpiry(maskExpiry(e.target.value))}
              placeholder="MM/AA"
              className="input"
            />
          </div>
        </label>
        <label className="block">
          <div className="mb-1.5 text-[11px] font-bold tracking-wider text-white/60 uppercase">CVV</div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              required
              inputMode="numeric"
              autoComplete="cc-csc"
              disabled={disabled}
              value={cvv}
              onChange={(e) => setCvv(maskCVV(e.target.value, brand))}
              placeholder={brand === "amex" ? "0000" : "000"}
              className="input"
            />
          </div>
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-1 w-full h-12 rounded-xl text-[13px] font-semibold tracking-wide text-white bg-[#5B3DF5]/90 hover:bg-[#5B3DF5] border border-white/10 hover:border-white/15 shadow-[0_8px_24px_-12px_rgba(91,61,245,0.6)] hover:shadow-[0_10px_28px_-12px_rgba(91,61,245,0.7)] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
      >
        {busy || submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {busy ? "Validando cartão..." : submitting ? "Processando..." : submitLabel}
      </button>

    </form>
  );
}
