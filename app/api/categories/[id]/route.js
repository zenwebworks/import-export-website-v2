import { invalidateCatalogue } from "@/lib/catalogue-cache";
import { validObjectId } from "@/lib/request-params";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categorySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";
import { deleteImage } from "@/lib/cloudinary";
import { normalizeCategory } from "@/lib/data";

export async function PUT(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });

    await connectDB();
    const duplicate = await Category.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
    if (duplicate) return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });

    const existing = await Category.findById(id);
    if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const category = await Category.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true }).lean();
    if (!category) return NextResponse.json({ error: "Record no longer exists" }, { status: 404 });
    invalidateCatalogue();
    if (parsed.data.image && existing.image?.publicId && parsed.data.image?.publicId !== existing.image.publicId) {
      await deleteImage(existing.image.publicId).catch(() => null);
    }

    return NextResponse.json({ category: normalizeCategory(category) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    await connectDB();

    const inUse = await Product.countDocuments({ category: id });
    if (inUse > 0) return NextResponse.json({ error: `Cannot delete: ${inUse} product(s) still use this category.` }, { status: 409 });

    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    invalidateCatalogue();
    if (category.image?.publicId) await deleteImage(category.image.publicId).catch(() => null);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
