const MAX_BYTES = 5 * 1024 * 1024;

// Only fetch the site's configured upload provider, never a URL supplied to the OG endpoint.
export function ogPhotoUrl(source, cloudName) {
  if (!source || !cloudName) return null;
  try {
    const url = new URL(source);
    const prefix = `/${cloudName}/image/upload/`;
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com" || url.port || url.username || url.password || !url.pathname.startsWith(prefix)) return null;
    const imagePath = url.pathname.slice(prefix.length);
    if (!imagePath || imagePath.startsWith("s--")) return null;
    // PNG is supported by ImageResponse, including uploads originally stored as WebP or AVIF.
    url.pathname = `${prefix}c_limit,w_800,h_800/f_png/${imagePath}`;
    url.search = "";
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

export async function loadOgPhoto(source, { cloudName = process.env.CLOUDINARY_CLOUD_NAME, fetcher = fetch } = {}) {
  const url = ogPhotoUrl(source, cloudName);
  if (!url) return null;
  try {
    const response = await fetcher(url, { signal: AbortSignal.timeout(6000), redirect: "error", cache: "no-store" });
    if (!response.ok || !response.body || Number(response.headers.get("content-length")) > MAX_BYTES) {
      await response.body?.cancel();
      return null;
    }
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const buffer = Buffer.concat(chunks);
    if (!buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return null;
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}
