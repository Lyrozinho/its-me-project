export function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-8">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative h-7 w-7 rounded-md bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] grid place-items-center">
            <div className="absolute inset-0 rounded-md blur-md bg-[#7A5CFF]/50 -z-10" />
            <span className="text-white text-[11px] font-black">L</span>
          </div>
          <span className="text-xs text-white/50">
            © {new Date().getFullYear()} Love Hyro. Todos os direitos reservados.
          </span>
        </div>
        <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">
          Minha Conta
        </a>
      </div>
    </footer>
  );
}
