export const dynamic = "force-dynamic";
import { getAllSlugs } from "@/lib/data";
import { absoluteUrl, escapeXml } from "@/lib/seo";

export async function GET() {
  try {
    const { products, categories } = await getAllSlugs();
    const routes = ["/", "/about", "/products", "/categories", "/sourcing", "/export-services", "/import-services", "/collaboration", "/request-a-quote", "/contact", "/privacy-policy"].map(path => ({ path }));
    routes.push(...categories.map(row => ({ path: `/categories/${encodeURIComponent(row.slug)}`, updatedAt: row.updatedAt })), ...products.map(row => ({ path: `/products/${encodeURIComponent(row.slug)}`, updatedAt: row.updatedAt })));
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(({ path, updatedAt }) => `  <url><loc>${escapeXml(absoluteUrl(path))}</loc>${updatedAt ? `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>` : ""}</url>`).join("\n")}
</urlset>`;
    return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "Cache-Control": "no-cache" } });
  } catch {
    return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
  }
}
