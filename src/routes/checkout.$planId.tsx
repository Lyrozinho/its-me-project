import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Zap, Clock, Infinity as InfinityIcon, CheckCircle2, Lock, User, Mail, Phone, IdCard } from "lucide-react";
import { Background } from "@/components/genesis/Background";
import { Navbar } from "@/components/genesis/Navbar";
import { Footer } from "@/components/genesis/Footer";
import { getPlanById, formatBRL } from "@/lib/plans";
import { PixIcon } from "@/components/genesis/PixIcon";
import { PixModal } from "@/components/genesis/PixModal";
import { createPixCharge } from "@/lib/checkout.functions";

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
      <Footer />
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
  const [charge, setCharge] = useState<null | {
    id: string;
    qrCodeBase64: string | null;
    qrCodeText: string | null;
    expiresAt: string | null;
    amount: number;
  }>(null);

  const discount = useMemo(() => plan.old - plan.price, [plan]);

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

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const c = await createPixCharge({
        data: {
          planId: plan.id,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerDocument: onlyDigits(form.cpf),
        },
      });
      setCharge(c);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao gerar Pix. Tente novamente.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dark relative min-h-screen text-white overflow-x-hidden">
      <Background />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8 pt-20 sm:pt-24 pb-16 lg:pt-28">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-3 py-1.5 text-[11px] font-medium text-white/70">
            <Lock className="h-3 w-3 text-[#A78BFA]" /> Ambiente seguro
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="mt-4 text-[26px] sm:text-4xl font-bold tracking-tight leading-tight"
        >
          Finalize sua <span className="text-gradient">compra</span>
        </motion.h1>
        <p className="mt-2 text-[13px] sm:text-sm text-white/55">Preencha seus dados. A ativação é automática após o pagamento via PIX.</p>

        <div className="mt-6 sm:mt-10 grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">

          {/* FORM */}
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-8"
          >
            <form onSubmit={submit} className="space-y-5" noValidate>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-white/50 uppercase">
                <span className="h-6 w-6 rounded-full grid place-items-center bg-[#5B3DF5]/20 border border-[#7A5CFF]/40 text-[10px] text-[#A78BFA]">1</span>
                Dados do comprador
              </div>

              <Field label="Nome completo" icon={User} error={errors.name}>
                <input
                  required
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
                type="submit"
                disabled={submitting}
                className="mt-2 w-full h-12 rounded-xl text-[13px] font-semibold tracking-wide text-white bg-[#5B3DF5]/90 hover:bg-[#5B3DF5] border border-white/10 hover:border-white/15 shadow-[0_8px_24px_-12px_rgba(91,61,245,0.6)] hover:shadow-[0_10px_28px_-12px_rgba(91,61,245,0.7)] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
              >
                <PixIcon className="h-4 w-4" />
                {submitting ? "Gerando Pix..." : `Pagar ${formatBRL(plan.price)} com Pix`}
              </button>


              <p className="text-center text-[11px] text-white/40 inline-flex items-center gap-1.5 justify-center w-full">
                <ShieldCheck className="h-3 w-3 text-[#A78BFA]" />
                Seus dados são criptografados e usados apenas para emissão do pedido.
              </p>
            </form>
          </motion.section>

          {/* SUMMARY */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:sticky lg:top-28 h-fit rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
          >
            <div className="relative p-3 sm:p-4">
              <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/10">
                <img src={plan.image} alt={plan.title} className="absolute inset-0 h-full w-full object-cover" />
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

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatBRL(plan.old)} muted />
                <Row label="Desconto" value={`- ${formatBRL(discount)}`} accent />
                <div className="h-px bg-white/10 my-2" />
                <div className="flex items-end justify-between">
                  <div className="text-xs text-white/50">Total à vista</div>
                  <div className="text-2xl font-black tracking-tight">
                    <span className="text-gradient">{formatBRL(plan.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
      <Footer />

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

function Row({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-white/50" : "text-white/70"}>{label}</span>
      <span className={accent ? "text-[#A78BFA] font-semibold" : "text-white"}>{value}</span>
    </div>
  );
}


