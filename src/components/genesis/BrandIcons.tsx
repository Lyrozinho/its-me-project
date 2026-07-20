// Small badge component that renders real card brand logos from icons8 (same source as the PIX icon).
import type { CardBrand } from "@/lib/card";

const LOGOS: Record<Exclude<CardBrand, "unknown">, string> = {
  visa: "https://img.icons8.com/color/48/visa.png",
  mastercard: "https://img.icons8.com/color/48/mastercard-logo.png",
  amex: "https://img.icons8.com/color/48/amex.png",
  elo: "https://img.icons8.com/color/48/elo.png",
  hipercard: "https://img.icons8.com/color/48/hipercard.png",
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
      src={LOGOS[brand]}
      alt={LABELS[brand]}
      width={36}
      height={24}
      draggable={false}
      className={`${className} object-contain select-none`}
    />
  );
}

export function AcceptedBrands({ className = "" }: { className?: string }) {
  // Bandeiras aceitas pelo Mercado Pago (crédito) no Brasil.
  const list: Exclude<CardBrand, "unknown">[] = ["mastercard", "visa", "elo", "amex", "hipercard"];
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {list.map((b) => (
        <div
          key={b}
          className="h-7 w-10 rounded-md bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-sm grid place-items-center"
          title={LABELS[b]}
        >
          <BrandIcon brand={b} className="h-4 w-7" />
        </div>
      ))}
    </div>
  );
}
