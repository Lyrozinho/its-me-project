import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, User } from "lucide-react";

const NAV = [
  { label: "Início", href: "#hero" },
  { label: "Produtos", href: "#produtos" },
  { label: "Categorias", href: "#categorias" },
  { label: "Revenda", href: "#revenda" },
  { label: "Suporte", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-[rgba(11,7,21,0.72)] border-b border-white/5"
          : "backdrop-blur-md bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-16 items-center gap-6">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 shrink-0">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] grid place-items-center">
              <div className="absolute inset-0 rounded-lg blur-md bg-[#7A5CFF]/50 -z-10" />
              <span className="text-white text-sm font-black">G</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              Genesis<span className="text-[#A78BFA]"> Hub</span>
            </span>
          </a>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((i) => (
              <a
                key={i.label}
                href={i.href}
                className="px-3 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {i.label}
              </a>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7A5CFF]/0 via-[#7A5CFF]/20 to-[#7A5CFF]/0 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity" />
              <div className="relative flex items-center rounded-full glass px-4 h-10">
                <Search className="h-4 w-4 text-white/50" />
                <input
                  placeholder="Buscar produtos, categorias..."
                  className="flex-1 bg-transparent border-0 outline-none text-sm px-3 placeholder:text-white/40"
                />
                <kbd className="hidden lg:inline text-[10px] text-white/50 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button className="h-10 px-4 rounded-full text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-2">
              <User className="h-4 w-4" /> Minha Conta
            </button>
            <button className="h-10 px-5 rounded-full text-sm font-medium text-white bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5] shadow-[0_10px_30px_-10px_rgba(91,61,245,0.7)] hover:brightness-110 transition-all">
              Começar
            </button>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden ml-auto h-10 w-10 grid place-items-center rounded-full glass"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-4 mb-4 rounded-2xl glass-strong p-4"
          >
            <div className="flex items-center rounded-full bg-white/5 border border-white/10 px-4 h-10 mb-3">
              <Search className="h-4 w-4 text-white/50" />
              <input placeholder="Buscar..." className="flex-1 bg-transparent border-0 outline-none text-sm px-3 placeholder:text-white/40" />
            </div>
            <nav className="grid gap-1">
              {NAV.map((i) => (
                <a key={i.label} href={i.href} onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/5">{i.label}</a>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="h-10 rounded-full text-sm border border-white/10">Entrar</button>
              <button className="h-10 rounded-full text-sm font-medium text-white bg-gradient-to-b from-[#7A5CFF] to-[#5B3DF5]">Começar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
