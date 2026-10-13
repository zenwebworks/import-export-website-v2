import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { unstable_cache } from "next/cache";
import { CATALOGUE_TAG } from "./catalogue-cache";
import { OG_SIZE, OG_VERSION } from "./social";
import { loadOgPhoto } from "./og-photo";

const navy = "#09283d";
const gold = "#dfbd73";
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

function TradeGlobe() {
  return (
    <svg width="480" height="480" viewBox="0 0 480 480" fill="none">
      <circle cx="240" cy="240" r="204" fill="#103b50" stroke="#356070" strokeWidth="1.5" />
      <circle cx="240" cy="240" r="160" stroke="#527480" strokeWidth="1.5" />
      <ellipse cx="240" cy="240" rx="84" ry="160" stroke="#527480" strokeWidth="1.5" />
      <ellipse cx="240" cy="240" rx="160" ry="62" stroke="#527480" strokeWidth="1.5" />
      <path d="M80 240H400M240 80V400M113 143H367M113 337H367" stroke="#527480" strokeWidth="1.5" />
      <path d="M104 304C148 129 268 115 375 206M146 359C223 275 323 275 375 206" stroke={gold} strokeWidth="3" />
      <circle cx="104" cy="304" r="10" fill={gold} />
      <circle cx="375" cy="206" r="10" fill={gold} />
      <circle cx="146" cy="359" r="7" fill={gold} />
      <circle cx="270" cy="158" r="7" fill={gold} />
      <circle cx="240" cy="240" r="229" stroke="#356070" strokeWidth="1" strokeDasharray="3 12" />
    </svg>
  );
}

export function SocialCard({ logo, photo, data }) {
  const isItem = Boolean(photo && data?.kind !== "global");
  const title = cardText(data?.name || "", 100);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: navy, color: "#fff", fontFamily: "sans-serif", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 7, background: gold }} />
      <div style={{ position: "absolute", top: 40, left: 64, display: "flex" }}>
        <img src={logo} width={264} height={116} alt="" />
      </div>
      <div style={{ position: "absolute", top: 202, left: 64, width: isItem ? 560 : 600, display: "flex", flexDirection: "column" }}>
        <div style={{ color: gold, fontSize: 17, letterSpacing: 3, marginBottom: 22 }}>
          {isItem ? data.kind === "products" ? "EXPORT PRODUCT" : "EXPLORE OUR CATEGORIES" : "CONNECTING GLOBAL MARKETS"}
        </div>
        {isItem ? (
          <div style={{ display: "flex", fontSize: title.length > 55 ? 42 : 54, lineHeight: 1.12, letterSpacing: -1.3, wordBreak: "break-word", maxHeight: 200, overflow: "hidden" }}>{title}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.08, letterSpacing: -2 }}>
            <span>Ramshel</span><span>Global Trade</span>
          </div>
        )}
        <div style={{ display: "flex", marginTop: 24, fontSize: 23, color: "#c2d1da", lineHeight: 1.4 }}>
          {isItem ? cardText(data.category || "Quality products. Worldwide supply.", 58) : "Import • Export • Global Sourcing"}
        </div>
      </div>
      {isItem ? (
        <div style={{ position: "absolute", left: 704, top: 78, width: 432, height: 432, display: "flex", background: "#fff", padding: 20, borderRadius: 24, border: "1px solid #d7e1e7" }}>
          <img src={photo} alt="" width={392} height={392} style={{ objectFit: "contain" }} />
        </div>
      ) : (
        <div style={{ position: "absolute", right: 36, top: 54, display: "flex" }}><TradeGlobe /></div>
      )}
      <div style={{ display: "flex", position: "absolute", bottom: 0, left: 64, right: 64, height: 76, alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #365366", fontSize: 17, letterSpacing: 1.5 }}>
        <span style={{ color: gold }}>FROM INDIA. TO THE WORLD.</span>
        <span style={{ color: "#bccdd7", fontSize: 15 }}>RAMSHEL ENTERPRISES PVT LTD</span>
      </div>
    </div>
  );
}

async function renderImage(data, photo = null) {
  const logo = await logoData();
  const response = new ImageResponse(<SocialCard logo={logo} photo={photo} data={data} />, OG_SIZE);
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
