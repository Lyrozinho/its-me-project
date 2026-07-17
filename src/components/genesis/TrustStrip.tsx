import { CheckCircle2 } from "lucide-react";

const ITEMS = ["Entrega automática 24h", "PIX instantâneo", "Suporte 24/7"];

export function TrustStrip() {
  return (
    <section className="relative border-y border-white/5 bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-around gap-6">
          {ITEMS.map((t) => (
            <div key={t} className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#A78BFA]" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
