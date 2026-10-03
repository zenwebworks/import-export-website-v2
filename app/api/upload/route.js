import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { uploadImage } from "@/lib/cloudinary";
import { MAX_IMAGE_UPLOAD_BYTES, MAX_IMAGE_UPLOAD_MB, getDataUriImageMeta, isAcceptedImageType } from "@/lib/upload-config";

const MAX_JSON_UPLOAD_BYTES = Math.ceil(MAX_IMAGE_UPLOAD_BYTES * 1.4) + 1024;

export async function POST(request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_JSON_UPLOAD_BYTES) {
      return NextResponse.json({ error: `Image must be ${MAX_IMAGE_UPLOAD_MB}MB or smaller` }, { status: 413 });
    }

    const body = await request.json();
    const { file } = body;
    const imageMeta = getDataUriImageMeta(file);

    if (!imageMeta || !isAcceptedImageType(imageMeta.type)) {
      return NextResponse.json({ error: "Upload a valid JPG, PNG, WebP or AVIF image" }, { status: 400 });
    }

    if (imageMeta.sizeBytes > MAX_IMAGE_UPLOAD_BYTES) {
      return NextResponse.json({ error: `Image must be ${MAX_IMAGE_UPLOAD_MB}MB or smaller` }, { status: 413 });
    }

    const result = await uploadImage(file);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Image upload failed" }, { status: 500 });
  }
}