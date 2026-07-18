import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#7A5CFF] to-[#5B3DF5] grid place-items-center">
              <span className="text-white text-[13px] font-black">L</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Love Hyro</span>
          </a>

          <div className="hidden sm:flex items-center gap-2 shrink-0 ml-auto">
            <ShimmerCTA href="#planos">Começar agora</ShimmerCTA>
            <a
              href="#login"
              className="h-10 px-4 rounded-full text-sm text-white/85 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-2"
            >
              <User className="h-4 w-4" /> Login
            </a>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="sm:hidden ml-auto h-10 w-10 grid place-items-center rounded-full bg-white/5 border border-white/10"
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
            className="sm:hidden mx-4 mb-4 rounded-2xl bg-[#131024] border border-white/10 p-4"
          >
            <div className="grid gap-2">
              <ShimmerCTA href="#planos" onClick={() => setOpen(false)} block>
                Começar agora
              </ShimmerCTA>
              <a
                href="#login"
                onClick={() => setOpen(false)}
                className="h-11 rounded-full text-sm font-medium text-white/90 hover:text-white bg-white/5 border border-white/10 inline-flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" /> Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ShimmerCTA({
  href,
  children,
  onClick,
  block,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  block?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative inline-flex ${block ? "w-full h-11" : "h-10"} items-center justify-center overflow-hidden rounded-full px-5 text-sm font-semibold text-white bg-[#5B3DF5] hover:bg-[#6a4cf7] transition-colors shadow-[0_8px_24px_-12px_rgba(122,92,255,0.7)]`}
    >
      <span className="relative z-10">{children}</span>
      {/* Sheen animado passando sozinho */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/35 to-transparent"
        style={{ mixBlendMode: "overlay" }}
      />
    </a>
  );
}
