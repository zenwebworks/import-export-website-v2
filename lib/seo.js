export function resolveSiteUrl(value) {
  const url = new URL(value || "http://localhost:3000");
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be the site's HTTP(S) origin, without a path or credentials.");
  }
  if (url.hostname === "example.com" || url.hostname.endsWith(".example.com")) throw new Error("Replace the example NEXT_PUBLIC_SITE_URL with your website's domain.");
  return url.origin;
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const IS_PUBLIC_SITE = new URL(SITE_URL).protocol === "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(SITE_URL).hostname);
export function absoluteUrl(path = "/") { return new URL(path, `${SITE_URL}/`).href; }
export function jsonLd(value) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
export function escapeXml(value) { return String(value).replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]); }
export function catalogueMetadata(path, { page = 1, search = "", category = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  return {
    alternates: { canonical: `${path}${params.size ? `?${params}` : ""}` },
    ...(search || category ? { robots: { index: false, follow: true } } : {}),
  };
}
