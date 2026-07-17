const COLS = [
  { title: "Produto", items: ["Recursos", "Preços", "Integrações", "Novidades", "Roadmap"] },
  { title: "Empresa", items: ["Sobre", "Carreiras", "Imprensa", "Parceiros", "Contato"] },
  { title: "Recursos", items: ["Documentação", "Guias", "API", "Status", "Comunidade"] },
  { title: "Legal", items: ["Privacidade", "Termos", "Segurança", "Cookies", "Licenças"] },
];

export function Footer() {
  return (
    <footer className="relative pt-24 pb-10 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] grid place-items-center">
                <div className="absolute inset-0 rounded-lg blur-md bg-[#7A5CFF]/50 -z-10" />
                <span className="text-white text-sm font-black">G</span>
              </div>
              <span className="text-base font-semibold tracking-tight">
                Genesis<span className="text-[#A78BFA]"> Hub</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-white/55 max-w-sm leading-relaxed">
              A plataforma premium para produtos digitais, revendedores e times ambiciosos.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {["X", "IG", "YT", "LI"].map((s) => (
                <a key={s} href="#" className="h-9 w-9 rounded-full glass grid place-items-center text-[11px] text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <div className="text-[11px] uppercase tracking-[0.15em] text-white/40">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/40">© {new Date().getFullYear()} Genesis Hub. Todos os direitos reservados.</div>
          <div className="text-xs text-white/40">Feito com precisão em São Paulo.</div>
        </div>
      </div>
    </footer>
  );
}
