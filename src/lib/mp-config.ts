// Mercado Pago publishable configuration (safe for the client bundle).
// The Public Key is designed to be exposed; the Access Token stays server-only.
export const MP_PUBLIC_KEY = "APP_USR-988f8040-2d74-44da-a5c6-54a5b42e5f27";

/** Card processing fee (Mercado Pago average for approved credit, à vista). */
export const CARD_FEE_RATE = 0.0498;

/** Round to cents. */
export function withCardFee(amount: number): number {
  return Math.round(amount * (1 + CARD_FEE_RATE) * 100) / 100;
}
