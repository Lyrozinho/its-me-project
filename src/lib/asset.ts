// Resolves Lovable CDN asset URLs to absolute URLs.
// Asset pointers ship a root-relative URL like "/__l5e/assets-v1/<id>/<file>",
// which is served by any *.lovable.app host. When the app is deployed on a
// non-Lovable host (e.g. Vercel), that path 404s. Prefix it with the stable
// project host so images load anywhere.

const CDN_BASE = "https://project--f3ee8690-1aa5-4b2e-8d61-a5794424fd38.lovable.app";

export function assetUrl(a: { url: string } | string): string {
  const url = typeof a === "string" ? a : a.url;
  if (/^https?:\/\//i.test(url)) return url;
  return CDN_BASE + url;
}
