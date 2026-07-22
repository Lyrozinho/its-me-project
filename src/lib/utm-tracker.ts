// Persists UTM / src / sck parameters seen on the landing URL so we can
// forward them to Utmify when the order is created and when it is paid.
const KEY = "lovehyro:utms";
const FIELDS = ["src", "sck", "utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term"] as const;
export type Utms = Partial<Record<(typeof FIELDS)[number], string>>;

export function captureUtms(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const cur = getUtms();
    let touched = false;
    for (const k of FIELDS) {
      const v = url.searchParams.get(k);
      if (v) {
        cur[k] = v;
        touched = true;
      }
    }
    if (touched) window.sessionStorage.setItem(KEY, JSON.stringify(cur));
  } catch {
    /* ignore */
  }
}

export function getUtms(): Utms {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Utms) : {};
  } catch {
    return {};
  }
}
