export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[var(--ink-950)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(122,92,255,0.10),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7A5CFF]/40 to-transparent" />
    </div>
  );
}
