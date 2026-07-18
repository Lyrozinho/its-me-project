import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Key, Lock, Mail, Calendar, Copy, Check, Download, ShieldCheck, Search, Package, Fingerprint } from "lucide-react";
import { Background } from "@/components/genesis/Background";
import { Navbar } from "@/components/genesis/Navbar";
import { useIssuedLicenses, type StoredLicense } from "@/lib/pix-store";
import { getDeviceInfo, getPublicIp } from "@/lib/device";

export const Route = createFileRoute("/minhas-compras")({
  head: () => ({
    meta: [
      { title: "Minhas compras - Love Hyro" },
      { name: "description", content: "Acesse suas chaves de licença Love Hyro e baixe a extensão." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PurchasesPage,
});

function PurchasesPage() {
  const all = useIssuedLicenses();
  const [query, setQuery] = useState("");
  const [device, setDevice] = useState<{ id: string; fingerprint: string; ip?: string } | null>(null);

  useEffect(() => {
    const d = getDeviceInfo();
    setDevice({ id: d.id, fingerprint: d.fingerprint });
    getPublicIp().then((ip) => setDevice((cur) => (cur ? { ...cur, ip } : cur)));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? all.filter((l) =>
        [l.licenseKey, l.email, l.planLabel, l.paymentId].some((v) => v.toLowerCase().includes(q)),
      )
    : all;

  return (
    <div className="dark relative min-h-screen text-white overflow-x-hidden">
      <Background />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 sm:px-5 lg:px-8 pt-28 sm:pt-32 pb-24">
        <div className="mb-6 flex items-center justify-between gap-3">
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
            <ShieldCheck className="h-3.5 w-3.5 text-[#A78BFA]" />
            Vinculado ao seu dispositivo
          </div>
        </div>

        <motion.header
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="text-[10px] font-bold tracking-[0.18em] text-[#A78BFA] uppercase">Minha área</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Minhas compras</h1>
          <p className="mt-2 text-[14px] text-white/60 max-w-xl">
            Todas as licenças emitidas neste dispositivo aparecem aqui. Copie sua chave e baixe a extensão para ativar.
          </p>
        </motion.header>

        <div className="mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por chave, e-mail ou ID"
              className="w-full h-12 rounded-2xl bg-white/[0.03] border border-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#7A5CFF]/60"
            />
          </div>
          <a
            href="https://chromewebstore.google.com/"
            target="_blank"
            rel="noreferrer"
            className="h-12 px-5 rounded-2xl bg-[#5B3DF5]/90 hover:bg-[#5B3DF5] border border-white/10 text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" /> Baixar extensão
          </a>
        </div>

        {filtered.length === 0 ? (
          <EmptyState hasAny={all.length > 0} />
        ) : (
          <div className="grid gap-3">
            {filtered.map((l) => (
              <LicenseCard key={l.paymentId} license={l} />
            ))}
          </div>
        )}

        {device && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-white/50">
            <span className="inline-flex items-center gap-2"><Fingerprint className="h-3.5 w-3.5 text-[#A78BFA]" /> Dispositivo <span className="font-mono text-white/70">{device.fingerprint}</span></span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>ID <span className="font-mono text-white/70">{device.id.slice(0, 18)}</span></span>
            {device.ip && (<><span className="hidden sm:inline text-white/20">•</span><span>IP <span className="font-mono text-white/70">{device.ip}</span></span></>)}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center bg-[#5B3DF5]/15 border border-[#7A5CFF]/30">
        <Package className="h-7 w-7 text-[#A78BFA]" />
      </div>
      <h3 className="mt-4 text-xl font-black">
        {hasAny ? "Nenhum resultado" : "Nenhuma compra por aqui ainda"}
      </h3>
      <p className="mt-2 text-[13.5px] text-white/55 max-w-md mx-auto">
        {hasAny
          ? "Ajuste sua busca para ver as licenças deste dispositivo."
          : "Assim que você concluir uma compra, sua licença aparece aqui automaticamente, vinculada a este dispositivo."}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#5B3DF5] hover:bg-[#6a4cf7] px-5 text-[13px] font-semibold transition-colors"
      >
        Ver planos
      </Link>
    </div>
  );
}

function LicenseCard({ license }: { license: StoredLicense }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
    } catch { /* ignore */ }
  };
  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };
  const expiresMs = new Date(license.expiresAt).getTime() - Date.now();
  const active = expiresMs > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="min-w-0 flex items-center gap-3">
          <span className="h-9 w-9 shrink-0 rounded-xl grid place-items-center bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5]">
            <Key className="h-4 w-4 text-white" />
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-bold tracking-wider text-white/45 uppercase">Licença</div>
            <div className="truncate text-[14px] font-black">{license.planLabel}</div>
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-black tracking-wider rounded-full px-2.5 py-1 border ${active ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" : "bg-white/[0.04] text-white/55 border-white/10"}`}>
          {active ? "ATIVA" : "EXPIRADA"}
        </span>
      </div>

      <div className="p-3 sm:p-4 grid gap-2.5">
        <Row icon={Key} label="Chave da licença" value={license.licenseKey} mono field="key" copied={copied === "key" + license.paymentId} onCopy={(v) => copy("key" + license.paymentId, v)} />
        <Row icon={Lock} label="Senha" value={license.password} mono field="pass" copied={copied === "pass" + license.paymentId} onCopy={(v) => copy("pass" + license.paymentId, v)} />
        <Row icon={Mail} label="E-mail cadastrado" value={license.email} field="mail" copied={copied === "mail" + license.paymentId} onCopy={(v) => copy("mail" + license.paymentId, v)} />
        <Row icon={Calendar} label="Válida até" value={fmt(license.expiresAt)} field="exp" copied={copied === "exp" + license.paymentId} onCopy={(v) => copy("exp" + license.paymentId, v)} />
      </div>
      <div className="px-4 sm:px-5 pb-3 text-[10.5px] text-white/40 font-mono">Pagamento {license.paymentId}</div>
    </motion.article>
  );
}

function Row({ icon: Icon, label, value, mono, copied, onCopy }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean; field: string; copied: boolean; onCopy: (v: string) => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 flex items-center gap-3">
      <span className="h-8 w-8 shrink-0 rounded-lg grid place-items-center bg-[#5B3DF5]/15 border border-[#7A5CFF]/30">
        <Icon className="h-4 w-4 text-[#A78BFA]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold tracking-wider text-white/45 uppercase">{label}</div>
        <div className={`truncate text-[13px] text-white ${mono ? "font-mono tracking-wide" : ""}`}>{value}</div>
      </div>
      <button
        onClick={() => onCopy(value)}
        className="shrink-0 h-8 w-8 grid place-items-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white transition-colors"
        aria-label={`Copiar ${label}`}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
