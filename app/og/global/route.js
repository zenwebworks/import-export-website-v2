import { globalOgImage, pngResponse } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return pngResponse(await globalOgImage(), { cacheSeconds: 86400 });
}
