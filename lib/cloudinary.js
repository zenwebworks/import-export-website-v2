import { v2 as cloudinary } from "cloudinary";
import { IMAGE_UPLOAD_MAX_DIMENSION } from "@/lib/upload-config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(fileDataUri, folder = process.env.CLOUDINARY_FOLDER || "meridian-global-trade") {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured");
  }

  const result = await cloudinary.uploader.upload(fileDataUri, {
    folder,
    resource_type: "image",
    transformation: [{ width: IMAGE_UPLOAD_MAX_DIMENSION, height: IMAGE_UPLOAD_MAX_DIMENSION, crop: "limit", quality: "auto:good" }],
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId) {
  if (!publicId || !process.env.CLOUDINARY_CLOUD_NAME) return null;
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
