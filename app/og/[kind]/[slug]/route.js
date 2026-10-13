import { getCategoryBySlug, getProductBySlug } from "@/lib/data";
import { catalogueOgImage, globalOgImage, pngResponse } from "@/lib/og-image";
import { socialCardData } from "@/lib/social";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { kind, slug } = await params;
  if (!["products", "categories"].includes(kind) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 200) {
    return new Response("Image not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const item = await (kind === "products" ? getProductBySlug(slug) : getCategoryBySlug(slug));
    if (!item) return new Response("Image not found", { status: 404, headers: { "Cache-Control": "no-store" } });
    return pngResponse(await catalogueOgImage(socialCardData(kind, item)));
  } catch {
    // A temporary catalogue outage must not poison the normal image cache.
    return pngResponse(await globalOgImage(), { cacheSeconds: 0 });
  }
}
