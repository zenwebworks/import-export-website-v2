import { absoluteUrl, IS_PUBLIC_SITE } from "@/lib/seo";

export default function robots() {
  return {
    rules: IS_PUBLIC_SITE
      ? { userAgent: "*", allow: ["/", "/admin/login"], disallow: ["/admin", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
