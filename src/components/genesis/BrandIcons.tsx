// Real, color card brand badges (flat-rounded set) served via jsDelivr.
import type { CardBrand } from "@/lib/card";

const BASE = "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@main/flat-rounded";

const FILES: Record<Exclude<CardBrand, "unknown">, string> = {
  visa: `${BASE}/visa.svg`,
  mastercard: `${BASE}/mastercard.svg`,
  amex: `${BASE}/amex.svg`,
  elo: `${BASE}/elo.svg`,
  hipercard: `${BASE}/hipercard.svg`,
};

const LABELS: Record<Exclude<CardBrand, "unknown">, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  elo: "Elo",
  hipercard: "Hipercard",
};

export function BrandIcon({ brand, className = "h-5 w-8" }: { brand: CardBrand; className?: string }) {
  if (brand === "unknown") return null;
  return (
    <img
      src={FILES[brand]}
      alt={LABELS[brand]}
      draggable={false}
      className={`${className} object-contain select-none`}
    />
  );
}

export function AcceptedBrands({ className = "" }: { className?: string }) {
  const list: Exclude<CardBrand, "unknown">[] = ["mastercard", "visa", "elo", "amex", "hipercard"];
  return (
    <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 ${className}`}>
      {list.map((b) => (
        <img
          key={b}
          src={FILES[b]}
          alt={LABELS[b]}
          title={LABELS[b]}
          draggable={false}
          className="h-5 w-8 sm:h-6 sm:w-9 object-contain select-none opacity-95"
        />
      ))}
    </div>
  );
}
