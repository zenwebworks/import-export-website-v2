import test from "node:test";
import assert from "node:assert/strict";
import { socialImage, withSocialMetadata } from "../lib/social.js";
import { loadOgPhoto, ogPhotoUrl } from "../lib/og-photo.js";

const product = { name: "White Rice", slug: "white-rice", image_url: "https://res.cloudinary.com/test/image/upload/v1/rice.webp", category: { name: "Food" }, updated_at: "2026-10-01" };

test("social cards use absolute versioned PNG URLs and descriptive alt text", () => {
  const image = socialImage("products", product);
  assert.equal(new URL(image.url).pathname, "/og/products/white-rice");
  assert.match(new URL(image.url).searchParams.get("v"), /^[a-f0-9]{16}$/);
  assert.equal(image.width, 1200);
  assert.equal(image.height, 630);
  assert.equal(image.type, "image/png");
  assert.match(image.alt, /White Rice.*Ramshel Global Trade/);
});

test("admin edits change sharing URLs, including a product's category rename", () => {
  const before = socialImage("products", product).url;
  assert.equal(before, socialImage("products", { ...product }).url);
  for (const change of [{ name: "Brown Rice" }, { image_url: `${product.image_url}?new` }, { updated_at: "2026-10-02" }, { category: { name: "Agriculture" } }]) {
    assert.notEqual(before, socialImage("products", { ...product, ...change }).url);
  }
  assert.notEqual(socialImage("categories", product).url, before);
});

test("page metadata preserves SEO rules and uses the same complete OG/Twitter card", () => {
  const metadata = withSocialMetadata({ title: "Products", description: "Our catalogue", alternates: { canonical: "/products?page=2" }, robots: { index: false, follow: true } });
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.equal(metadata.alternates.canonical, "/products?page=2");
  assert.equal(new URL(metadata.openGraph.url).search, "?page=2");
  assert.equal(metadata.openGraph.title, "Products");
  assert.equal(metadata.openGraph.description, "Our catalogue");
  assert.equal(metadata.openGraph.siteName, "Ramshel Global Trade");
  assert.equal(metadata.openGraph.type, "website");
  assert.equal(metadata.twitter.card, "summary_large_image");
  assert.equal(metadata.twitter.images[0].url, metadata.openGraph.images[0].url);
  assert.equal(new URL(metadata.openGraph.images[0].url).pathname, "/og/global");
});

test("existing page-specific social titles survive, old hero images are replaced", () => {
  const metadata = withSocialMetadata({ title: "Import Services", openGraph: { title: "From the world", url: "/import-services", images: ["old.webp"] }, twitter: { title: "From the world", images: ["old.webp"] } });
  assert.equal(metadata.openGraph.title, "From the world");
  assert.equal(metadata.twitter.title, "From the world");
  assert.match(metadata.openGraph.url, /^https?:\/\//);
  assert.equal(metadata.openGraph.images[0].url, socialImage().url);
});

test("only the configured Cloudinary account is fetched, in bounded PNG format", () => {
  assert.equal(ogPhotoUrl(product.image_url, "test"), "https://res.cloudinary.com/test/image/upload/c_limit,w_800,h_800/f_png/v1/rice.webp");
  for (const source of ["http://127.0.0.1/secret", "file:///etc/passwd", "https://res.cloudinary.com.evil.test/test/image/upload/a", "https://user:secret@res.cloudinary.com/test/image/upload/a", "https://res.cloudinary.com/other/image/upload/a", "https://res.cloudinary.com/test/image/fetch/a", "not a url"]) {
    assert.equal(ogPhotoUrl(source, "test"), null);
  }
});

test("missing, broken, oversized and non-PNG photos safely fall back", async () => {
  let calls = 0;
  const fetcher = async () => { calls++; throw new Error("unreachable"); };
  assert.equal(await loadOgPhoto("", { cloudName: "test", fetcher }), null);
  assert.equal(calls, 0);
  assert.equal(await loadOgPhoto(product.image_url, { cloudName: "test", fetcher }), null);
  for (const response of [new Response("missing", { status: 404 }), new Response("not an image"), new Response("too big", { headers: { "content-length": String(6 * 1024 * 1024) } }), new Response(new Uint8Array(6 * 1024 * 1024))]) {
    assert.equal(await loadOgPhoto(product.image_url, { cloudName: "test", fetcher: async () => response }), null);
  }
});

test("photo loading supplies an abort deadline, blocks redirects and returns inline PNG bytes", async () => {
  const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const result = await loadOgPhoto(product.image_url, { cloudName: "test", fetcher: async (url, options) => {
    assert.equal(options.redirect, "error");
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(bytes);
  } });
  assert.equal(result, `data:image/png;base64,${bytes.toString("base64")}`);
});
