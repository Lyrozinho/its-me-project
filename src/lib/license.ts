// License key + password generation utilities.
// Both client-safe (no server-only imports).

const ALPHA_KEY = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0, I/1 confusion
const ALPHA_PASS = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randStr(alphabet: string, length: number): string {
  let out = "";
  const cryptoObj = typeof globalThis !== "undefined" ? (globalThis.crypto as Crypto | undefined) : undefined;
  if (cryptoObj?.getRandomValues) {
    const arr = new Uint32Array(length);
    cryptoObj.getRandomValues(arr);
    for (let i = 0; i < length; i++) out += alphabet[arr[i] % alphabet.length];
  } else {
    for (let i = 0; i < length; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/** Ex: HYRO-4K2A-9PXV-7M3Q */
export function generateLicenseKey(): string {
  return `HYRO-${randStr(ALPHA_KEY, 4)}-${randStr(ALPHA_KEY, 4)}-${randStr(ALPHA_KEY, 4)}`;
}

/** 10-char alphanumeric password */
export function generateLicensePassword(): string {
  return randStr(ALPHA_PASS, 10);
}

/** Compute expiry from a plan "hours" label such as "60 MINUTOS" | "24 HORAS" | "720 HORAS" */
export function computeExpiresAt(hoursLabel: string, from = new Date()): Date {
  const m = hoursLabel.match(/(\d+)\s*(MIN|HOR)/i);
  const n = m ? parseInt(m[1], 10) : 0;
  const isMinutes = m ? /MIN/i.test(m[2]) : false;
  const ms = isMinutes ? n * 60_000 : n * 3_600_000;
  return new Date(from.getTime() + (ms || 60 * 60_000));
}
