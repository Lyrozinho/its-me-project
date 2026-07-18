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
  customerName?: string;
  customerEmail?: string;
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
  // A paid charge whose license hasn't been issued yet is still "active" for recovery.
  if (c.status === "paid") {
    const lic = getIssuedLicense(c.id);
    return lic ? null : c;
  }
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
  deviceId?: string;
  fingerprint?: string;
  ip?: string;
};

const LICENSE_KEY = "lovehyro:license:latest";
const LICENSES_LIST_KEY = "lovehyro:licenses:list";
const LICENSES_EVT = "lovehyro:licenses:changed";

export function saveIssuedLicense(l: StoredLicense) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LICENSE_KEY, JSON.stringify(l));
    const list = getAllIssuedLicenses();
    const without = list.filter((x) => x.paymentId !== l.paymentId);
    const next = [l, ...without].slice(0, 50);
    window.localStorage.setItem(LICENSES_LIST_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(LICENSES_EVT));
  } catch { /* ignore */ }
}

export function getIssuedLicense(paymentId?: string): StoredLicense | null {
  if (typeof window === "undefined") return null;
  try {
    if (paymentId) {
      const list = getAllIssuedLicenses();
      const hit = list.find((x) => x.paymentId === paymentId);
      if (hit) return hit;
    }
    const raw = window.localStorage.getItem(LICENSE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLicense;
    if (paymentId && parsed.paymentId !== paymentId) return null;
    return parsed;
  } catch { return null; }
}

export function getAllIssuedLicenses(): StoredLicense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LICENSES_LIST_KEY);
    if (!raw) {
      // Backward-compat: fall back to the single latest license if the list
      // hasn't been populated yet (users who purchased before this feature).
      const solo = window.localStorage.getItem(LICENSE_KEY);
      if (!solo) return [];
      const one = JSON.parse(solo) as StoredLicense;
      return [one];
    }
    const list = JSON.parse(raw) as StoredLicense[];
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

export function useIssuedLicenses(): StoredLicense[] {
  const [list, setList] = useState<StoredLicense[]>([]);
  useEffect(() => {
    const refresh = () => setList(getAllIssuedLicenses());
    refresh();
    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LICENSES_LIST_KEY || e.key === LICENSE_KEY) refresh();
    };
    window.addEventListener(LICENSES_EVT, onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LICENSES_EVT, onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return list;
}


