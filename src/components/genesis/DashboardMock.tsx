import { motion } from "framer-motion";

const HERO_VISUAL = "/assets/hero-visual.png";

export function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      className="group relative mx-auto w-full max-w-[480px] [perspective:1200px]"
    >
      {/* Outer purple ambient glow — intensifies on hover */}
      <motion.div
        aria-hidden
        className="absolute -inset-8 -z-20 rounded-[2.75rem]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(122,92,255,0.45), rgba(122,92,255,0.10) 55%, transparent 75%)",
          filter: "blur(28px)",
        }}
        initial={{ opacity: 0.6, scale: 1 }}
        variants={{ hover: { opacity: 1, scale: 1.08 } }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Stacked back plate (right) — visible shoulder for layered depth */}
      <motion.div
        aria-hidden
        className="absolute -right-5 top-7 bottom-3 left-9 -z-10 rounded-[2rem] bg-gradient-to-br from-[#1b1236] to-[#090612] border border-white/[0.07] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
        initial={{ x: 0, y: 0 }}
        variants={{ hover: { x: 7, y: 8 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Stacked back plate (left) — mirrored visible shoulder */}
      <motion.div
        aria-hidden
        className="absolute -left-5 top-7 right-9 bottom-3 -z-10 rounded-[2rem] bg-gradient-to-bl from-[#1b1236] to-[#090612] border border-white/[0.07] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
        initial={{ x: 0, y: 0 }}
        variants={{ hover: { x: -7, y: 8 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Bottom spacer plate so both sides read as one clean stacked card */}
      <motion.div
        aria-hidden
        className="absolute -left-3 -right-3 bottom-[-10px] h-16 -z-20 rounded-b-[2rem] bg-[#08050f] border-x border-b border-white/[0.05] shadow-[0_28px_55px_-25px_rgba(122,92,255,0.55)]"
        initial={{ y: 0, opacity: 0.8 }}
        variants={{ hover: { y: 6, opacity: 1 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Bezel — subtle 3D tilt + lift on hover */}
      <motion.div
        className="relative rounded-[2rem] bg-gradient-to-b from-[#1a1330] to-[#0f0a1f] p-3 border border-white/10 shadow-[0_25px_60px_-15px_rgba(91,61,245,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] will-change-transform"
        initial={{ rotateX: 0, rotateY: 0, y: 0 }}
        variants={{ hover: { rotateX: 4, rotateY: 0, y: -6 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative rounded-[1.4rem] overflow-hidden aspect-square bg-[#0d0819]">
          <motion.img
            src={HERO_VISUAL}
            alt="Love Hyro"
            width={1024}
            height={1024}
            fetchPriority="high"
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            variants={{ hover: { scale: 1.06 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Sheen sweep on hover */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
            }}
            initial={{ x: "-40%", opacity: 0 }}
            variants={{ hover: { x: "320%", opacity: 1 } }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Inner highlights */}
          <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-1 ring-inset ring-white/10" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[1.4rem]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
