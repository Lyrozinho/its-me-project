const PIX_ICON = "/assets/pix-icon.png";

export function PixIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <img
      src={PIX_ICON}
      alt="Pix"
      width={64}
      height={64}
      draggable={false}
      className={`${className} object-contain select-none`}
    />
  );
}
