import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, User, ShoppingCart } from "lucide-react";

const NAV = [
  { label: "Categorias", href: "#categorias" },
  { label: "Meus Pedidos", href: "#pedidos" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[rgba(11,7,21,0.85)] backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-16 items-center gap-8">
          <a href="#hero" className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] grid place-items-center">
              <span className="text-white text-[13px] font-black">G</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Genesis</span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((i) => (
              <a key={i.label} href={i.href}
                className="px-3 py-2 text-sm text-white/75 hover:text-white transition-colors">
                {i.label}
              </a>
            ))}
            <a href="#revenda"
              className="ml-1 px-4 py-1.5 text-sm font-medium rounded-full text-white bg-[#5B3DF5] hover:bg-[#6a4cf7] transition-colors">
              Revenda
            </a>
          </nav>

          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative flex items-center w-full rounded-full bg-white/[0.04] border border-white/10 px-4 h-10 focus-within:border-[#7A5CFF]/50 transition-colors">
              <Search className="h-4 w-4 text-white/40" />
              <input placeholder="Pesquisar produtos..."
                className="flex-1 bg-transparent outline-none text-sm px-3 placeholder:text-white/40" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
            <button aria-label="Carrinho" className="h-10 w-10 grid place-items-center rounded-full text-white/75 hover:text-white hover:bg-white/5 transition-colors">
              <ShoppingCart className="h-4.5 w-4.5" />
            </button>
            <button className="h-10 px-4 rounded-full text-sm text-white/85 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-2">
              <User className="h-4 w-4" /> Entrar
            </button>
          </div>

          <button aria-label="Menu" onClick={() => setOpen((o) => !o)}
            className="lg:hidden ml-auto h-10 w-10 grid place-items-center rounded-full bg-white/5 border border-white/10">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-4 mb-4 rounded-2xl bg-[#131024] border border-white/10 p-4">
            <div className="flex items-center rounded-full bg-white/5 border border-white/10 px-4 h-10 mb-3">
              <Search className="h-4 w-4 text-white/50" />
              <input placeholder="Pesquisar..." className="flex-1 bg-transparent outline-none text-sm px-3 placeholder:text-white/40" />
            </div>
            <nav className="grid gap-1">
              {NAV.map((i) => (
                <a key={i.label} href={i.href} onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/5">{i.label}</a>
              ))}
              <a href="#revenda" onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#5B3DF5]">Revenda</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
