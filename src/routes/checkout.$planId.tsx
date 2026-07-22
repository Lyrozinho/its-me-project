import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Zap, Clock, Infinity as InfinityIcon, CheckCircle2, Lock, User, Mail, Phone, IdCard, CreditCard } from "lucide-react";
import { Background } from "@/components/genesis/Background";
import { Navbar } from "@/components/genesis/Navbar";

import { getPlanById, formatBRL } from "@/lib/plans";
import { PixIcon } from "@/components/genesis/PixIcon";
import { PixModal } from "@/components/genesis/PixModal";
import { CardForm, type TokenizedCard } from "@/components/genesis/CardForm";
import { CardResultModal } from "@/components/genesis/CardResultModal";
import { AcceptedBrands } from "@/components/genesis/BrandIcons";
import { createPixCharge } from "@/lib/checkout.functions";
import { createCardPayment } from "@/lib/mercadopago.functions";
import { withCardFee } from "@/lib/mp-config";
import { getActiveCharge, saveActiveCharge, clearActiveCharge, useActiveCharge } from "@/lib/pix-store";


export const Route = createFileRoute("/checkout/$planId")({
  head: ({ params }) => ({
    meta: [
      { title: `Checkout ${params.planId} - Love Hyro` },
      { name: "description", content: "Finalize sua compra da extensão Love Hyro com PIX e ativação automática." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params }) => {
    const plan = getPlanById(params.planId);
    if (!plan) throw notFound();
    return { plan };
  },
  component: CheckoutPage,
  notFoundComponent: PlanNotFound,
});

function PlanNotFound() {
  return (
    <div className="dark relative min-h-screen text-white">
      <Background />
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 pt-40 pb-24 text-center">
        <h1 className="text-3xl font-bold">Plano não encontrado</h1>
        <p className="mt-3 text-white/60">Este produto não existe ou foi removido.</p>
        <Link to="/" className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-[#5B3DF5] px-5 text-sm font-semibold hover:bg-[#6a4cf7] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar para a loja
        </Link>
      </main>
      
    </div>
  );
}

// ---------- Utils ----------
function onlyDigits(v: string) { return v.replace(/\D+/g, ""); }
function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}
function validCPF(cpf: string) {
  const d = onlyDigits(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (base: number) => {
    let sum = 0;
    for (let i = 0; i < base; i++) sum += parseInt(d[i]) * (base + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === parseInt(d[9]) && calc(10) === parseInt(d[10]);
}

// ---------- Page ----------
function CheckoutPage() {
  const { plan } = Route.useLoaderData();
  const [form, setForm] = useState({ name: "", email: "", phone: "", cpf: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [charge, setCharge] = useState<null | {
    id: string;
    qrCodeBase64: string | null;
    qrCodeText: string | null;
    expiresAt: string | null;
    amount: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerCpf?: string;
    planId?: string;
  }>(null);
  const [cardResult, setCardResult] = useState<null | { id: string; status: string; statusDetail: string; amount: number }>(null);

  const lastAttemptRef = useRef(0);
  const cardAmount = withCardFee(plan.price);

  // Open the modal from stored PIX on:
  //  1) initial mount (recover after refresh/navigation back)
  //  2) explicit "open request" event fired by the floating mini card
  // We do NOT auto-reopen on every store tick — otherwise minimizing would bounce back.
  useEffect(() => {
    const openFromStore = () => {
      const stored = getActiveCharge();
      if (!stored || stored.planId !== plan.id) return;
      setCharge({
        id: stored.id,
        qrCodeBase64: stored.qrCodeBase64,
        qrCodeText: stored.qrCodeText,
        expiresAt: new Date(stored.expiresAt).toISOString(),
        amount: stored.amount,
        customerName: stored.customerName,
        customerEmail: stored.customerEmail,
        planId: stored.planId,
      });

    };
    openFromStore();
    const onOpen = () => openFromStore();
    window.addEventListener("lovehyro:pix:open", onOpen);
    return () => window.removeEventListener("lovehyro:pix:open", onOpen);
  }, [plan.id]);

  // Lock the form while there is a pending PIX (any plan). Unlocks the instant it expires/is cleared.
  const storedCharge = useActiveCharge();
  const locked = !!storedCharge;
  const lockedThisPlan = !!storedCharge && storedCharge.planId === plan.id;




  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Digite seu nome completo";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "E-mail inválido";
    if (onlyDigits(form.phone).length < 10) e.phone = "Telefone incompleto";
    if (!validCPF(form.cpf)) e.cpf = "CPF inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generatePix = async () => {
    setServerError(null);
    const active = getActiveCharge();
    if (active) {
      if (active.planId !== plan.id) {
        setServerError("Você já tem um Pix em aberto de outro plano. Finalize ou aguarde expirar antes de gerar outro.");
        return;
      }
      setCharge({
        id: active.id,
        qrCodeBase64: active.qrCodeBase64,
        qrCodeText: active.qrCodeText,
        expiresAt: new Date(active.expiresAt).toISOString(),
        amount: active.amount,
        customerName: active.customerName,
        customerEmail: active.customerEmail,
        planId: active.planId,
      });
      return;
    }
    const now = Date.now();
    if (now - lastAttemptRef.current < 8000) {
      setServerError("Aguarde alguns segundos antes de tentar novamente.");
      return;
    }
    if (!validate()) return;
    lastAttemptRef.current = now;
    setSubmitting(true);
    try {
      const { getUtms } = await import("@/lib/utm-tracker");
      const c = await createPixCharge({
        data: {
          planId: plan.id,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerDocument: onlyDigits(form.cpf),
          customerPhone: onlyDigits(form.phone),
          tracking: getUtms(),
        },
      });
      setCharge({ ...c, customerName: form.name.trim(), customerEmail: form.email.trim(), customerPhone: onlyDigits(form.phone), customerCpf: onlyDigits(form.cpf), planId: plan.id });
      const remoteExpiry = c.expiresAt ? new Date(c.expiresAt).getTime() : NaN;
      const expiresAt = Number.isFinite(remoteExpiry) && remoteExpiry > Date.now()
        ? remoteExpiry
        : Date.now() + 5 * 60 * 1000;
      const serverCreatedMs = c.createdAt ? new Date(c.createdAt).getTime() : Date.now();
      saveActiveCharge({
        planId: plan.id, planTitle: plan.title, id: c.id,
        qrCodeBase64: c.qrCodeBase64, qrCodeText: c.qrCodeText,
        expiresAt, amount: c.amount,
        createdAt: Number.isFinite(serverCreatedMs) ? serverCreatedMs : Date.now(),
        status: "pending",
        customerName: form.name.trim(), customerEmail: form.email.trim(),
        customerPhone: onlyDigits(form.phone), customerCpf: onlyDigits(form.cpf),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao gerar Pix. Tente novamente.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardTokenized = async (card: TokenizedCard) => {
    setServerError(null);
    if (!validate()) {
      setServerError("Preencha seus dados corretamente antes de pagar.");
      throw new Error("dados incompletos");
    }
    setSubmitting(true);
    try {
      const res = await createCardPayment({
        data: {
          planId: plan.id,
          token: card.token,
          paymentMethodId: card.paymentMethodId,
          issuerId: card.issuerId ?? null,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerDocument: onlyDigits(form.cpf),
        },
      });
      setCardResult(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha no cartão. Verifique os dados.";
      setServerError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="dark relative min-h-screen text-white overflow-x-hidden">
      <Background />
      <main className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8 pt-6 sm:pt-8 pb-24 lg:pt-10">
        <div className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-10 pl-2 pr-4 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-colors text-[13px] text-white/85"
          >
            <span className="h-7 w-7 rounded-full grid place-items-center bg-white/[0.05] border border-white/10">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            Voltar
          </Link>
          <div className="inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-white/10 bg-white/[0.03] text-[12px] text-white/80">
            <Lock className="h-3.5 w-3.5 text-[#A78BFA]" />
            Checkout <span className="font-semibold text-white">100% seguro</span>
          </div>
        </div>
        <Stepper current={charge || cardResult ? 2 : 1} />

        <div className="mt-5 sm:mt-6 grid gap-5 lg:gap-7 lg:grid-cols-[minmax(0,1fr)_420px]">



          {/* FORM */}
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-8"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-white/50 uppercase">
                <span className="h-6 w-6 rounded-full grid place-items-center bg-[#5B3DF5]/20 border border-[#7A5CFF]/40 text-[10px] text-[#A78BFA]">1</span>
                Dados do comprador
              </div>

              <Field label="Nome completo" icon={User} error={errors.name}>
                <input
                  required
                  disabled={locked}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Como está no documento"
                  autoComplete="name"
                  className="input"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="E-mail" icon={Mail} error={errors.email}>
                  <input
                    required
                    disabled={locked}
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="voce@email.com"
                    autoComplete="email"
                    className="input"
                  />
                </Field>
                <Field label="Telefone" icon={Phone} error={errors.phone}>
                  <input
                    required
                    disabled={locked}
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", maskPhone(e.target.value))}
                    placeholder="(11) 91234-5678"
                    autoComplete="tel"
                    className="input"
                  />
                </Field>
              </div>

              <Field label="CPF" icon={IdCard} error={errors.cpf}>
                <input
                  required
                  disabled={locked}
                  inputMode="numeric"
                  value={form.cpf}
                  onChange={(e) => set("cpf", maskCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  className="input"
                />
              </Field>

              <div className="pt-3 flex items-center gap-2 text-[11px] font-bold tracking-wider text-white/50 uppercase">
                <span className="h-6 w-6 rounded-full grid place-items-center bg-[#5B3DF5]/20 border border-[#7A5CFF]/40 text-[10px] text-[#A78BFA]">2</span>
                Pagamento
              </div>

              {/* Method tabs */}
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.03] border border-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setMethod("pix")}
                  className={[
                    "h-11 rounded-xl text-[12.5px] font-semibold inline-flex items-center justify-center gap-2 transition-all",
                    method === "pix" ? "bg-[#5B3DF5]/90 text-white shadow-[0_4px_20px_-8px_rgba(91,61,245,0.6)]" : "text-white/70 hover:text-white",
                  ].join(" ")}
                >
                  <PixIcon className="h-4 w-4" /> PIX
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={[
                    "h-11 rounded-xl text-[12.5px] font-semibold inline-flex items-center justify-center gap-2 transition-all",
                    method === "card" ? "bg-[#5B3DF5]/90 text-white shadow-[0_4px_20px_-8px_rgba(91,61,245,0.6)]" : "text-white/70 hover:text-white",
                  ].join(" ")}
                >
                  <CreditCard className="h-4 w-4" /> Cartão
                </button>
              </div>

              {method === "pix" ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                    <div className="h-10 w-10 rounded-xl grid place-items-center bg-white shrink-0">
                      <PixIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">PIX · Aprovação instantânea</div>
                      <div className="text-[11px] sm:text-xs text-white/50 leading-snug">Liberação automática assim que o pagamento é confirmado.</div>
                    </div>
                    <span className="shrink-0 text-[10px] font-black tracking-wider rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 px-2 py-1">RECOMENDADO</span>
                  </div>

                  {serverError && (
                    <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-200">
                      {serverError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={generatePix}
                    disabled={submitting}
                    className="mt-2 w-full h-12 rounded-xl text-[13px] font-semibold tracking-wide text-white bg-[#5B3DF5]/90 hover:bg-[#5B3DF5] border border-white/10 hover:border-white/15 shadow-[0_8px_24px_-12px_rgba(91,61,245,0.6)] hover:shadow-[0_10px_28px_-12px_rgba(91,61,245,0.7)] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
                  >
                    <PixIcon className="h-4 w-4" />
                    {submitting
                      ? "Gerando Pix..."
                      : lockedThisPlan
                        ? "Abrir Pix em aberto"
                        : locked
                          ? "Pix ativo em outro plano"
                          : `Pagar ${formatBRL(plan.price)} com Pix`}
                  </button>

                  {locked && (
                    <p className="text-center text-[11px] text-white/50">
                      Campos bloqueados enquanto houver um Pix em aberto. Liberam automaticamente ao expirar.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl grid place-items-center bg-white/[0.05] border border-white/10 shrink-0">
                      <CreditCard className="h-5 w-5 text-[#A78BFA]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">Cartão de crédito · à vista</div>
                      <div className="text-[11px] sm:text-xs text-white/50 leading-snug">
                        Inclui a taxa do cartão (4,98%). No PIX: {formatBRL(plan.price)}.
                      </div>
                    </div>
                    <AcceptedBrands className="hidden md:flex shrink-0" />
                  </div>
                  <div className="md:hidden -mt-2 flex items-center justify-between gap-2 px-1">
                    <span className="text-[11px] text-white/45">Bandeiras aceitas</span>
                    <AcceptedBrands />
                  </div>

                  {serverError && (
                    <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-200">
                      {serverError}
                    </div>
                  )}

                  <CardForm
                    cpf={form.cpf}
                    submitting={submitting}
                    disabled={locked}
                    submitLabel={`Pagar ${formatBRL(cardAmount)} no cartão`}
                    onTokenize={handleCardTokenized}
                  />
                </>
              )}


              <div className="pt-1 flex justify-center">
                <div className="inline-flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#A78BFA] shrink-0" strokeWidth={1.75} />
                  <p className="text-left text-[13.5px] leading-[1.55] font-normal text-white/[0.6]">
                    Seu pagamento é protegido por criptografia.
                    <br />
                    Após a confirmação, sua licença é liberada automaticamente.
                  </p>
                </div>
              </div>




            </div>
          </motion.section>

          {/* SUMMARY */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:sticky lg:top-28 h-fit rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
          >
            <div className="relative p-3 sm:p-4">
              <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/10">
                <img src={plan.image} alt={plan.title} loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#5B3DF5] px-3 py-1 text-[11px] font-black text-white">
                  <Zap className="h-3 w-3" /> {plan.duration}
                </span>
                <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur border border-white/10 px-2.5 py-1 text-[10px] font-mono tracking-wider text-white/80">
                  {plan.id}
                </span>
              </div>
            </div>

            <div className="px-5 sm:px-6 pb-5 sm:pb-6">

              <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase">Resumo do pedido</div>
              <h2 className="mt-2 text-lg font-black leading-snug">{plan.title}</h2>
              <p className="mt-1.5 text-[13px] text-white/55 leading-relaxed">{plan.description}</p>

              <ul className="mt-5 space-y-2.5">
                {[
                  { icon: InfinityIcon, text: "Créditos infinitos no Lovable.dev" },
                  { icon: Clock,        text: `Acesso liberado por ${plan.hours.toLowerCase()}` },
                  { icon: Zap,          text: "Ativação automática após o PIX" },
                  { icon: ShieldCheck,  text: "Suporte dedicado 24/7" },
                ].map((it, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/75">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full grid place-items-center bg-[#5B3DF5]/15 border border-[#7A5CFF]/30">
                      <it.icon className="h-3 w-3 text-[#A78BFA]" />
                    </span>
                    {it.text}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-end justify-between">
                  <div className="text-xs text-white/50">Total à vista no PIX</div>
                  <div className="text-2xl font-black tracking-tight">
                    <span className="text-gradient">{formatBRL(plan.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>


      {charge && (
        <PixModal
          charge={charge}
          onMinimize={() => setCharge(null)}
          onClose={() => { clearActiveCharge(); setCharge(null); }}
        />
      )}

      {cardResult && (
        <CardResultModal
          buyer={{
            planId: plan.id,
            paymentId: cardResult.id,
            customerName: form.name.trim(),
            customerEmail: form.email.trim(),
            customerPhone: onlyDigits(form.phone),
            customerCpf: onlyDigits(form.cpf),
          }}
          amount={cardResult.amount}
          status={cardResult.status}
          statusDetail={cardResult.statusDetail}
          onClose={() => setCardResult(null)}
        />
      )}


      <style>{`
        .input {
          width: 100%;
          height: 48px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.10);
          padding: 0 14px 0 40px;
          color: white;
          font-size: 14px;
          transition: border-color .2s, background .2s, box-shadow .2s;
          outline: none;
        }
        .input::placeholder { color: rgba(255,255,255,0.35); }
        .input:hover { border-color: rgba(255,255,255,0.18); }
        .input:focus {
          border-color: rgba(122,92,255,0.55);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 4px rgba(122,92,255,0.12);
        }
        .input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </div>
  );
}

function Field({
  label, icon: Icon, error, children,
}: { label: string; icon: React.ComponentType<{ className?: string }>; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[11px] font-bold tracking-wider text-white/60 uppercase">{label}</div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        {children}
      </div>
      {error && <div className="mt-1.5 text-[11px] text-[#F0ABFC]">{error}</div>}
    </label>
  );
}



function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Dados" },
    { n: 2, label: "Pagamento" },
    { n: 3, label: "Chaves" },
  ] as const;
  return (
    <div className="flex items-center justify-center">
      <ol className="flex w-full max-w-2xl items-center gap-2 sm:gap-3">
        {steps.map((s, i) => {
          const state = current > s.n ? "done" : current === s.n ? "active" : "todo";
          return (
            <li key={s.n} className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <span
                  className={[
                    "relative h-8 w-8 sm:h-9 sm:w-9 rounded-full grid place-items-center text-[12px] sm:text-[13px] font-bold transition-all",
                    state === "active"
                      ? "bg-[#5B3DF5]/15 text-white border border-[#7A5CFF] shadow-[0_0_0_4px_rgba(122,92,255,0.15),0_0_22px_-2px_rgba(122,92,255,0.55)]"
                      : state === "done"
                        ? "bg-[#5B3DF5] text-white border border-[#7A5CFF]"
                        : "bg-white/[0.03] text-white/45 border border-white/10",
                  ].join(" ")}
                >
                  {state === "done" ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </span>
                <span
                  className={[
                    "text-[11px] sm:text-[13px] font-bold tracking-wider uppercase transition-colors",
                    state === "todo" ? "text-white/40" : "text-white",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="relative flex-1 h-px min-w-4 sm:min-w-8">
                  <div className="absolute inset-0 bg-white/10" />
                  <div
                    className={[
                      "absolute inset-y-0 left-0 transition-all duration-500",
                      current > s.n ? "w-full bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF]" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}



