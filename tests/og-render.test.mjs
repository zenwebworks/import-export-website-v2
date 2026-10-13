import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import vm from "node:vm";
import { loadBindings, transform } from "next/dist/build/swc/index.js";
import { ImageResponse } from "next/og.js";
import { createElement } from "react";

// Reuse Next's own image decoder for pixel-level rendering checks.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const source = await readFile(new URL("../lib/og-image.jsx", import.meta.url), "utf8");
await loadBindings();
const { code } = await transform(source, { filename: "og-image.jsx", jsc: { parser: { syntax: "ecmascript", jsx: true }, transform: { react: { runtime: "automatic" } }, target: "es2022" }, module: { type: "es6" } });
const module = new vm.SourceTextModule(code);
await module.link(async specifier => {
  const values = specifier === "next/cache" ? { unstable_cache: fn => fn }
    : specifier === "./catalogue-cache" ? { CATALOGUE_TAG: "test-catalogue" }
    : specifier === "./social" ? await import("../lib/social.js")
    : specifier === "./og-photo" ? { loadOgPhoto: async () => null }
    : specifier === "next/og" ? { ImageResponse }
    : await import(specifier);
  return new vm.SyntheticModule(Object.keys(values), function () { for (const [key, value] of Object.entries(values)) this.setExport(key, value); });
});
await module.evaluate();
const { SocialCard, globalOgImage, catalogueOgImage, cardText, ogFonts } = module.namespace;
const logo = `data:image/png;base64,${(await readFile(new URL("../public/assets/og-logo.png", import.meta.url))).toString("base64")}`;

test("the actual global PNG contains visible logo pixels", async () => {
  const bytes = Buffer.from(await globalOgImage(), "base64");
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  const stats = await sharp(bytes).extract({ left: 150, top: 70, width: 900, height: 396 }).stats();
  assert.ok(stats.channels[0].stdev > 20, "Logo area must not be a blank background");
});

test("portrait and landscape photos render visibly, uncropped, inside the square panel", async () => {
  for (const [width, height, whiteX, whiteY] of [[100, 200, 674, 290], [200, 100, 920, 104]]) {
    const photo = await sharp({ create: { width, height, channels: 3, background: "#ff0000" } }).png().toBuffer();
    const response = new ImageResponse(createElement(SocialCard, { logo, photo: `data:image/png;base64,${photo.toString("base64")}`, data: { kind: "products", name: "Very long product title with detailed packaging and international export information ".repeat(4), category: "Food" } }), { width: 1200, height: 630, fonts: await ogFonts() });
    const bytes = Buffer.from(await response.arrayBuffer());
    const pixel = async (left, top) => Array.from(await sharp(bytes).extract({ left, top, width: 1, height: 1 }).removeAlpha().raw().toBuffer());
    assert.deepEqual(await pixel(920, 290), [255, 0, 0], "Photo must be visible");
    assert.deepEqual(await pixel(whiteX, whiteY), [255, 255, 255], "Contain must leave space beside portrait / above landscape photos");
  }
  assert.ok(Array.from(cardText("A".repeat(400), 100)).length <= 100);
});

test("an unavailable catalogue photo renders exactly the global fallback PNG", async () => {
  assert.equal(await catalogueOgImage({ kind: "categories", name: "No photo", image: "unavailable" }), await globalOgImage());
});
