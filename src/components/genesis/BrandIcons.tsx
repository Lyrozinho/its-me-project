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
  const list: Exclude<CardBrand, "unknown">[] = ["visa", "mastercard", "amex", "elo", "hipercard"];
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {list.map((b) => (
        <div
          key={b}
          className="h-6 w-9 rounded-md bg-white/[0.06] border border-white/10 grid place-items-center"
        >
          <BrandIcon brand={b} className="h-3.5 w-6" />
        </div>
      ))}
    </div>
  );
}
