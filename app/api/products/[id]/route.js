import { invalidateCatalogue } from "@/lib/catalogue-cache";
import Category from "@/models/Category";
import { validObjectId } from "@/lib/request-params";
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
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });

    await connectDB();
    if (!validObjectId(parsed.data.category) || !await Category.exists({ _id: parsed.data.category })) return NextResponse.json({ error: "Choose an existing category" }, { status: 400 });
    const duplicate = await Product.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
    if (duplicate) return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });

    const existing = await Product.findById(id);
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
      .populate("category", "name slug image description")
      .lean();
    if (!product) return NextResponse.json({ error: "Record no longer exists" }, { status: 404 });
    invalidateCatalogue();
    if (parsed.data.image && existing.image?.publicId && parsed.data.image?.publicId !== existing.image.publicId) {
      await deleteImage(existing.image.publicId).catch(() => null);
    }

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
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    await connectDB();

    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    invalidateCatalogue();
    if (product.image?.publicId) await deleteImage(product.image.publicId).catch(() => null);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
