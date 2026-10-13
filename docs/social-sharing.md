# Automatic social sharing images

Every public page supplies Open Graph and Twitter large-card metadata. General pages use the global Ramshel logo/name card. Product and category detail pages use the same branded template with their saved name and photo. Images are 1200 × 630 PNGs; catalogue photos fit inside a square panel without cropping. No additional admin fields or manually designed product images are needed.

## Routes and artwork

- `/og/global`: global brand image, generated using Next.js `ImageResponse`.
- `/og/products/[slug]` and `/og/categories/[slug]`: images generated from public catalogue records.
- `lib/og-image.jsx`: shared artwork and PNG rendering, running in the Node runtime.
- `lib/social.js`: complete social metadata and content-versioned image URLs.
- `public/assets/og-logo.png`: lossless PNG conversion of the existing WebP logo for the renderer. It is explicitly included in deployment file tracing.

These routes require no login and sit outside the robots-disallowed `/api/` path. They do not read enquiries, quotes, sessions or other admin data. Invalid kinds/slugs and missing records return 404. Missing, unsupported or broken photos use the global brand image. A temporary database error returns an uncached global image.

Only HTTPS images in the configured `CLOUDINARY_CLOUD_NAME` account are loaded. Cloudinary delivers a bounded PNG rendition of uploaded JPEG/PNG/WebP/AVIF photos. Redirects, arbitrary external hosts, signed URLs and non-upload resources are not fetched. Photo downloads have a six-second timeout and a five-megabyte cap. Existing non-Cloudinary image URLs continue to work on the website but use the global card for sharing.

## Caching and updates

Generated catalogue PNGs use the existing `public-catalogue` cache tag with a five-minute expiry; successful product/category admin writes already expire that tag. The global PNG is cached for a day. Rendered images are cached as base64, not regenerated on every request. CDN responses use the same respective lifetimes, with browser revalidation.

The metadata URL includes a content hash covering the template version, name, photo URL, category name and update timestamp. Admin edits therefore produce a new URL for new shares. Unknown query parameters never become render inputs or server-cache keys. Bump `OG_VERSION` in `lib/social.js` whenever the template or logo changes. An already shared link may retain its old preview in a social platform's independent cache until that platform re-scrapes it.

## Deployment and verification

Set `NEXT_PUBLIC_SITE_URL` to the confirmed public HTTPS origin **before building**, run `npm run check:seo`, and rebuild. Localhost previews cannot be fetched by external social crawlers. Do not put login protection in front of `/og/` in the hosting configuration.

Run `npm test` for OG metadata/versioning, photo fallbacks, fetch restrictions, and route behavior. Build and run the production app, then run `node scripts/check-og.mjs http://127.0.0.1:3110` (or the deployed origin) to verify public-page metadata, product/category image responses, dimensions, cache headers and unknown-record behavior without modifying catalogue data. After deployment, test a home, product and category link in the target sharing platforms; existing previews may require their refresh/debugging tool.
