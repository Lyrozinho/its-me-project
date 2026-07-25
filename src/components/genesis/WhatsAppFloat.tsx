import { motion } from "framer-motion";

const WHATS_NUMBER = "5527981359051";
const WHATS_URL = `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(
  "Olá! Vim do site Love Hyro e gostaria de ajuda.",
)}`;

export function WhatsAppFloat() {
  return (
    <motion.a
      href={WHATS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_30px_-6px_rgba(37,211,102,0.55)] sm:bottom-6 sm:right-6 sm:h-[60px] sm:w-[60px]"
      style={{
        background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full ring-1 ring-white/25"
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: "rgba(37,211,102,0.45)" }}
        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <svg
        viewBox="0 0 32 32"
        className="relative h-7 w-7 sm:h-8 sm:w-8"
        fill="white"
        aria-hidden
      >
        <path d="M19.11 17.28c-.29-.15-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.14-.19.29-.74.93-.91 1.12-.17.19-.34.22-.62.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.57-.9-2.15-.24-.57-.48-.49-.65-.5l-.55-.01c-.19 0-.51.07-.77.36-.26.29-1.01.99-1.01 2.42 0 1.43 1.04 2.81 1.18 3.01.15.19 2.04 3.11 4.94 4.36.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM16.02 5.33c-5.9 0-10.7 4.8-10.7 10.7 0 1.89.5 3.73 1.44 5.35L5 27.33l6.11-1.6c1.56.85 3.32 1.3 5.11 1.3h.01c5.9 0 10.7-4.8 10.7-10.7 0-2.86-1.11-5.55-3.13-7.57-2.02-2.02-4.71-3.14-7.58-3.14zm0 19.6h-.01c-1.6 0-3.16-.43-4.53-1.24l-.32-.19-3.62.95.97-3.53-.21-.34c-.89-1.42-1.36-3.06-1.36-4.75 0-4.9 3.99-8.89 8.9-8.89 2.37 0 4.61.93 6.29 2.61 1.68 1.68 2.61 3.92 2.6 6.29 0 4.9-3.99 8.89-8.89 8.89z" />
      </svg>
    </motion.a>
  );
}
