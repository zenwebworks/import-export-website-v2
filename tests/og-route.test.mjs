import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function route(lookup) {
  const source = await readFile(new URL("../app/og/[kind]/[slug]/route.js", import.meta.url), "utf8");
  const module = new vm.SourceTextModule(source);
  const dependencies = {
    "@/lib/data": { getCategoryBySlug: lookup, getProductBySlug: lookup },
    "@/lib/og-image": { catalogueOgImage: async data => data.name, globalOgImage: async () => "fallback", pngResponse: (data, options) => new Response(data, { headers: { "Cache-Control": options?.cacheSeconds === 0 ? "no-store" : "public" } }) },
    "@/lib/social": { socialCardData: (kind, item) => ({ kind, ...item }) },
  };
  await module.link(specifier => {
    const values = dependencies[specifier];
    return new vm.SyntheticModule(Object.keys(values), function () { for (const [key, value] of Object.entries(values)) this.setExport(key, value); });
  });
  await module.evaluate();
  return (kind, slug) => module.namespace.GET(new Request("https://site.test/og?image=http://127.0.0.1"), { params: Promise.resolve({ kind, slug }) });
}

test("OG endpoints reject private kinds and invalid slugs before accessing the database", async () => {
  const get = await route(() => { throw new Error("Must not query"); });
  for (const [kind, slug] of [["admin", "quotes"], ["products", "../private"], ["products", "a".repeat(201)], ["categories", "bad slug"]]) {
    const response = await get(kind, slug);
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
});

test("unknown catalogue entries return 404; temporary database failures serve an uncached brand card", async () => {
  const missing = await route(async () => null);
  assert.equal((await missing("products", "missing")).status, 404);
  const failing = await route(async () => { throw new Error("Database offline"); });
  const response = await failing("categories", "food");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(await response.text(), "fallback");
});

test("product and category cards use database content, ignoring arbitrary request image parameters", async () => {
  const slugs = [];
  const get = await route(async slug => { slugs.push(slug); return { name: "From database" }; });
  for (const kind of ["products", "categories"]) assert.equal(await (await get(kind, "rice")).text(), "From database");
  assert.deepEqual(slugs, ["rice", "rice"]);
});
