import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";
import { deleteImage } from "@/lib/cloudinary";
import { normalizeProduct } from "@/lib/data";

export async function PUT(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });

    await connectDB();
    const duplicate = await Product.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
    if (duplicate) return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });

    const existing = await Product.findById(id);
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (existing.image?.publicId && parsed.data.image?.publicId !== existing.image.publicId) {
      await deleteImage(existing.image.publicId).catch(() => null);
    }

    const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
      .populate("category", "name slug image description")
      .lean();
    return NextResponse.json({ product: normalizeProduct(product) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (product.image?.publicId) await deleteImage(product.image.publicId).catch(() => null);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
