import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { unstable_cache } from "next/cache";
import { CATALOGUE_TAG } from "./catalogue-cache";
import { OG_SIZE, OG_VERSION } from "./social";
import { loadOgPhoto } from "./og-photo";

const black = "#08090b";
const yellow = "#ffb51b";
let logoPromise;
function logoData() {
  return logoPromise ??= readFile(join(process.cwd(), "public/assets/og-logo.png"))
    .then(bytes => `data:image/png;base64,${bytes.toString("base64")}`)
    .catch(error => { logoPromise = undefined; throw error; });
}

export function cardText(value, limit) {
  const chars = Array.from(String(value).replace(/\s+/g, " ").trim());
  return chars.length > limit ? `${chars.slice(0, limit - 1).join("")}…` : chars.join("");
}

// Balance short names across two lines, while longer names use smaller, wrapping type.
function titleLayout(title) {
  const words = title.split(" ");
  if (title.length <= 28 && words.length > 1) {
    let split = 1;
    for (let i = 2; i < words.length; i++) {
      const difference = index => Math.abs(words.slice(0, index).join(" ").length - words.slice(index).join(" ").length);
      if (difference(i) < difference(split)) split = i;
    }
    const lines = [words.slice(0, split).join(" "), words.slice(split).join(" ")];
    return { lines, fontSize: Math.min(106, Math.floor(730 / Math.max(...lines.map(line => line.length)))) };
  }
  return { lines: [title], fontSize: title.length <= 10 ? 106 : title.length <= 28 ? 76 : title.length <= 55 ? 62 : 44 };
}

export function SocialCard({ logo, photo, data }) {
  const isItem = Boolean(photo && data?.kind !== "global");
  const title = titleLayout(cardText(data?.name || "", 100));
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: black, color: "#fff", fontFamily: "Geist", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 7, background: yellow }} />
      {isItem ? (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
          <div style={{ position: "absolute", top: 46, left: 70, display: "flex" }}>
            <img src={logo} width={370} height={163} alt="" />
          </div>
          <div style={{ position: "absolute", top: 242, left: 70, color: yellow, fontSize: 22, letterSpacing: 4 }}>
            {data.kind === "products" ? "PRODUCT" : "PRODUCT CATEGORY"}
          </div>
          <div style={{ position: "absolute", top: 286, left: 66, width: 530, height: 214, display: "flex", flexDirection: "column", fontSize: title.fontSize, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2.5, wordBreak: "break-word", overflow: "hidden" }}>
            {title.lines.map((line, index) => <div key={index} style={{ display: "flex", flexShrink: 0 }}>{line}</div>)}
          </div>
          <div style={{ position: "absolute", left: 70, top: 518, width: 114, height: 8, background: yellow }} />
          <div style={{ position: "absolute", left: 70, top: 546, color: yellow, fontSize: 22, letterSpacing: 4 }}>IMPORT AND EXPORT</div>
          <div style={{ position: "absolute", left: 634, top: 60, width: 510, height: 510, display: "flex", background: "#fff", padding: 18, borderRadius: 26 }}>
            <img src={photo} alt="" width={474} height={474} style={{ objectFit: "contain" }} />
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 }}>
          <img src={logo} width={900} height={396} alt="" />
          <div style={{ display: "flex", marginTop: 26, color: "#fff", fontSize: 56, fontWeight: 800, lineHeight: 1.2, letterSpacing: 12 }}>IMPORT AND EXPORT</div>
        </div>
      )}
    </div>
  );
}

let fontsPromise;
export function ogFonts() {
  return fontsPromise ??= Promise.all([
    readFile(join(process.cwd(), "public/assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "public/assets/fonts/Geist-ExtraBold.ttf")),
  ]).then(([regular, bold]) => [
    { name: "Geist", data: regular, weight: 400, style: "normal" },
    { name: "Geist", data: bold, weight: 800, style: "normal" },
  ]).catch(error => { fontsPromise = undefined; throw error; });
}

async function renderImage(data, photo = null) {
  const [logo, fonts] = await Promise.all([logoData(), ogFonts()]);
  const response = new ImageResponse(<SocialCard logo={logo} photo={photo} data={data} />, { ...OG_SIZE, fonts });
  // Consume the stream here so decoder/render failures reach the fallback handler.
  return Buffer.from(await response.arrayBuffer()).toString("base64");
}

export const globalOgImage = unstable_cache(() => renderImage({ kind: "global" }), ["global-og", OG_VERSION], { revalidate: 86400 });

export const catalogueOgImage = unstable_cache(async (data) => {
  const photo = await loadOgPhoto(data.image);
  if (photo) {
    try { return await renderImage(data, photo); }
    catch { /* An unreadable uploaded image uses the global brand card. */ }
  }
  return globalOgImage();
}, ["catalogue-og", OG_VERSION], { tags: [CATALOGUE_TAG], revalidate: 300 });

export function pngResponse(base64, { cacheSeconds = 300, status = 200 } = {}) {
  return new Response(Buffer.from(base64, "base64"), {
    status,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": cacheSeconds ? `public, max-age=0, s-maxage=${cacheSeconds}, must-revalidate` : "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
