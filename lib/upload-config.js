export const MAX_IMAGE_UPLOAD_MB = 3;
export const MAX_IMAGE_UPLOAD_BYTES = MAX_IMAGE_UPLOAD_MB * 1024 * 1024;
export const IMAGE_UPLOAD_MAX_DIMENSION = 1200;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const IMAGE_UPLOAD_HELP_TEXT = `JPG, PNG, WebP or AVIF up to ${MAX_IMAGE_UPLOAD_MB}MB`;

export function isAcceptedImageType(type) {
  return ACCEPTED_IMAGE_TYPES.includes(type);
}

export function getDataUriImageMeta(dataUri) {
  if (typeof dataUri !== "string") return null;

  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const [, type, base64Data] = match;
  const padding = base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0;
  const sizeBytes = Math.floor((base64Data.length * 3) / 4) - padding;

  return { type, sizeBytes };
}