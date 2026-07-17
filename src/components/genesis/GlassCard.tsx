import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

export function GlassCard({ children, className = "", interactive = true }: {
  children: ReactNode; className?: string; interactive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={interactive ? { y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`group relative rounded-3xl glass p-6 overflow-hidden ${className}`}
    >
      <div className="gradient-border-inner rounded-3xl" />
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(167,139,250,0.18), transparent 40%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
