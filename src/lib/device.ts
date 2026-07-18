// Device / environment fingerprint used to bind purchases to the buyer's
// device. This is client-side identification (not authentication) — enough
// to recover licenses reliably even if localStorage is partially wiped.

const KEY = "lovehyro:device:id";

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export type DeviceInfo = {
  id: string;
  fingerprint: string;
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screen: string;
  ip?: string;
};

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return { id: "ssr", fingerprint: "ssr", userAgent: "", platform: "", language: "", timezone: "", screen: "" };
  }
  const nav = window.navigator;
  const ua = nav.userAgent || "";
  const platform = (nav as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || nav.platform || "";
  const language = nav.language || "";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const screen = `${window.screen.width}x${window.screen.height}@${window.devicePixelRatio}`;
  const fingerprint = hash([ua, platform, language, timezone, screen].join("|"));

  let id = "";
  try { id = window.localStorage.getItem(KEY) || ""; } catch { /* ignore */ }
  if (!id) {
    id = `dev_${fingerprint}_${Math.random().toString(36).slice(2, 8)}`;
    try { window.localStorage.setItem(KEY, id); } catch { /* ignore */ }
  }
  return { id, fingerprint, userAgent: ua, platform, language, timezone, screen };
}

export async function getPublicIp(): Promise<string | undefined> {
  try {
    const r = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    if (!r.ok) return undefined;
    const j = (await r.json()) as { ip?: string };
    return j.ip;
  } catch { return undefined; }
}
