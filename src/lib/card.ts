// Client-safe helpers for card brand detection & input masking.

export type CardBrand = "visa" | "mastercard" | "amex" | "elo" | "hipercard" | "unknown";

export function detectBrand(digits: string): CardBrand {
  const n = digits.replace(/\D/g, "");
  if (!n) return "unknown";
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(4011|4312|4389|4514|4573|5041|5066|5090|6277|6362|6363|6504|6505|6516|6550)/.test(n)) return "elo";
  if (/^(606282|3841)/.test(n)) return "hipercard";
  return "unknown";
}

export function maskCardNumber(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 19);
  const brand = detectBrand(d);
  if (brand === "amex") {
    // 4-6-5 (15)
    return d.replace(/(\d{4})(\d{0,6})(\d{0,5}).*/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  }
  // 4-4-4-4(-3)
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function maskExpiry(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function maskCVV(v: string, brand: CardBrand): string {
  return v.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3);
}

export function validCardNumber(digits: string): boolean {
  const n = digits.replace(/\D/g, "");
  if (n.length < 13 || n.length > 19) return false;
  // Luhn
  let sum = 0;
  let alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function validExpiry(v: string): boolean {
  const m = v.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const end = new Date(year, month, 0, 23, 59, 59);
  return end.getTime() >= now.getTime();
}
