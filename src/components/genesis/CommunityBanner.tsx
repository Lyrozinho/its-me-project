import { MessageCircle, ArrowRight } from "lucide-react";

export function CommunityBanner() {
  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <a href="#" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-[#161029] to-[#1D1638] p-4 sm:p-5 hover:border-[#7A5CFF]/40 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-[#5B3DF5]/20 border border-[#7A5CFF]/30 grid place-items-center shrink-0">
            <MessageCircle className="h-5 w-5 text-[#A78BFA]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">Entre na comunidade Genesis</div>
            <div className="text-xs text-white/55 mt-0.5 truncate">Suporte rápido, novidades em primeira mão e networking com outros revendedores.</div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-center px-2">
            <div>
              <div className="text-sm font-semibold">2k+</div>
              <div className="text-[10px] uppercase tracking-wider text-white/45">Membros</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-300">Online</div>
              <div className="text-[10px] uppercase tracking-wider text-white/45">Agora</div>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#5B3DF5] grid place-items-center shrink-0 group-hover:bg-[#6a4cf7] transition-colors">
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </a>
      </div>
    </section>
  );
}
