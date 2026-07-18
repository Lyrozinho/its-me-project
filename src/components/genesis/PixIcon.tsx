import pixAsset from "@/assets/pix-icon.png.asset.json";
import { assetUrl } from "@/lib/asset";

export function PixIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <img
      src={pixAsset.url}
      alt="Pix"
      width={64}
      height={64}
      draggable={false}
      className={`${className} object-contain select-none`}
    />
  );
}
