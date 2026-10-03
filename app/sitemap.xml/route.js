export const dynamic = "force-dynamic";

import { getAllSlugs } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";

export async function GET() {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const staticRoutes = ["", "/products", "/categories", "/export-services", "/import-services", "/collaboration", "/request-a-quote", "/contact", "/privacy-policy"];
  let dynamicRoutes = [];

  try {
    const { products, categories } = await getAllSlugs();
    dynamicRoutes = [
      ...categories.map((category) => `/categories/${category.slug}`),
      ...products.map((product) => `/products/${product.slug}`),
    ];
  } catch {
    dynamicRoutes = [];
  }

  const routes = [...staticRoutes, ...dynamicRoutes];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>${route === "" ? "weekly" : "weekly"}</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "content-type": "application/xml" } });
}

