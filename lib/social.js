import { createHash } from "node:crypto";
import { SITE } from "./site.js";
import { absoluteUrl } from "./seo.js";

// Bump when the artwork or logo changes to refresh shared image URLs.
export const OG_VERSION = "2";
export const OG_SIZE = { width: 1200, height: 630 };

export function socialCardData(kind, item = {}) {
  return {
    kind,
    name: item.name || SITE.name,
    image: item.image_url || item.image?.url || "",
    category: kind === "products" ? item.category?.name || "" : "",
    updatedAt: String(item.updated_at || item.updatedAt || ""),
  };
}

export function socialImage(kind = "global", item) {
  const version = createHash("sha256")
    .update(JSON.stringify([OG_VERSION, SITE.name, socialCardData(kind, item)]))
    .digest("hex").slice(0, 16);
  const path = kind === "global" ? "/og/global" : `/og/${kind}/${encodeURIComponent(item.slug)}`;
  return {
    url: absoluteUrl(`${path}?v=${version}`),
    ...OG_SIZE,
    type: "image/png",
    alt: kind === "global" ? `${SITE.name} — Import, Export and Global Sourcing` : `${item.name} | ${SITE.name}`,
  };
}

// Next replaces nested metadata objects, so each page gets the complete social fields.
export function withSocialMetadata(metadata, { kind = "global", item } = {}) {
  const image = socialImage(kind, item);
  const title = typeof metadata.title === "string" ? metadata.title : metadata.title?.default || SITE.name;
  const description = metadata.description || SITE.description;
  return {
    ...metadata,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      ...metadata.openGraph,
      url: absoluteUrl(metadata.openGraph?.url || metadata.alternates?.canonical || "/"),
      images: [image],
    },
    twitter: {
      title,
      description,
      ...metadata.twitter,
      card: "summary_large_image",
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
