import { useEffect, useState } from "react";

export type StoredCharge = {
  planId: string;
  planTitle: string;
  id: string;
  qrCodeBase64: string | null;
  qrCodeText: string | null;
  expiresAt: number; // epoch ms
  amount: number;
  createdAt: number;
  status: "pending" | "paid" | "expired";
};

const KEY = "lovehyro:pix:active";
const EVT = "lovehyro:pix:changed";

function read(): StoredCharge | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCharge;
    if (!parsed || !parsed.id || !parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function write(v: StoredCharge | null) {
  if (typeof window === "undefined") return;
  if (v) window.localStorage.setItem(KEY, JSON.stringify(v));
  else window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getActiveCharge(): StoredCharge | null {
  const c = read();
  if (!c) return null;
  if (c.status === "pending" && c.expiresAt <= Date.now()) {
    write({ ...c, status: "expired" });
    return null;
  }
  if (c.status !== "pending") return null;
  return c;
}

export function saveActiveCharge(c: StoredCharge) {
  write(c);
}

export function updateActiveCharge(patch: Partial<StoredCharge>) {
  const cur = read();
  if (!cur) return;
  write({ ...cur, ...patch });
}

export function clearActiveCharge() {
  write(null);
}

export function useActiveCharge(): StoredCharge | null {
  const [charge, setCharge] = useState<StoredCharge | null>(null);

  useEffect(() => {
    const refresh = () => setCharge(getActiveCharge());
    refresh();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) refresh(); };
    const onCustom = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVT, onCustom as EventListener);
    // tick every second so it auto-clears on expiry
    const t = window.setInterval(refresh, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVT, onCustom as EventListener);
      window.clearInterval(t);
    };
  }, []);

  return charge;
}

// ---------- License persistence (survives clearActiveCharge) ----------
export type StoredLicense = {
  paymentId: string;
  licenseKey: string;
  password: string;
  email: string;
  planLabel: string;
  expiresAt: string; // ISO
  issuedAt: number;
};

const LICENSE_KEY = "lovehyro:license:latest";

export function saveIssuedLicense(l: StoredLicense) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LICENSE_KEY, JSON.stringify(l)); } catch { /* ignore */ }
}

export function getIssuedLicense(paymentId?: string): StoredLicense | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LICENSE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLicense;
    if (paymentId && parsed.paymentId !== paymentId) return null;
    return parsed;
  } catch { return null; }
}

