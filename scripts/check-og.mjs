import assert from "node:assert/strict";

const origin = new URL(process.argv[2] || "http://127.0.0.1:3110");
const headers = { "user-agent": "facebookexternalhit/1.1" };
const decode = value => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const imageUrls = new Set();
const pages = new Map();

async function checkPage(path, imagePath = "/og/global") {
  const response = await fetch(new URL(path, origin), { headers });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const tags = {};
  for (const tag of html.matchAll(/<meta\s[^>]+>/g)) {
    const key = tag[0].match(/(?:property|name)="([^"]+)"/)?.[1];
    const value = tag[0].match(/content="([^"]*)"/)?.[1];
    if (key && value !== undefined) tags[key] = decode(value);
  }
  assert.ok(tags["og:title"], `${path}: OG title`);
  assert.ok(tags["og:description"], `${path}: OG description`);
  assert.ok(tags["og:image:alt"], `${path}: image alt`);
  assert.equal(tags["og:site_name"], "Ramshel Global Trade", path);
  assert.equal(tags["og:image:width"], "1200", path);
  assert.equal(tags["og:image:height"], "630", path);
  assert.equal(tags["twitter:card"], "summary_large_image", path);
  assert.equal(tags["twitter:image"], tags["og:image"], path);
  const image = new URL(tags["og:image"]);
  assert.equal(image.pathname, imagePath, path);
  assert.ok(image.searchParams.get("v"), `${path}: version`);
  imageUrls.add(`${image.pathname}${image.search}`);
  pages.set(path, html);
  console.log(`PASS metadata ${path}`);
}

for (const path of ["/", "/about", "/categories", "/products", "/import-services", "/export-services", "/sourcing", "/collaboration", "/contact", "/request-a-quote", "/privacy-policy"]) await checkPage(path);

for (const kind of ["products", "categories"]) {
  const path = pages.get(`/${kind}`).match(new RegExp(`href="(/${kind}/[a-z0-9-]+)"`))?.[1];
  assert.ok(path, `Need at least one ${kind} record to verify detail metadata`);
  await checkPage(path, `/og${path}`);
}

for (const path of imageUrls) {
  const response = await fetch(new URL(path, origin), { headers });
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get("content-type"), "image/png", path);
  assert.match(response.headers.get("cache-control"), /s-maxage=/, path);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", path);
  assert.equal(bytes.readUInt32BE(16), 1200, path);
  assert.equal(bytes.readUInt32BE(20), 630, path);
  const repeat = await fetch(new URL(path, origin), { headers });
  assert.ok(bytes.equals(Buffer.from(await repeat.arrayBuffer())), `${path}: repeated output differs`);
  console.log(`PASS PNG 1200x630, cached response ${path} (${bytes.length} bytes)`);
}
for (const path of ["/og/products/og-check-nonexistent-record-987654321", "/og/categories/og-check-nonexistent-record-987654321", "/og/admin/quotes", "/og/products/invalid_slug"]) {
  assert.equal((await fetch(new URL(path, origin), { headers })).status, 404, path);
}
console.log("PASS missing records and invalid routes return 404. No catalogue data was modified.");
