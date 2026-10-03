import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categorySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";
import { normalizeCategory } from "@/lib/data";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ categories: categories.map(normalizeCategory) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
    }

    await connectDB();
    const existing = await Category.findOne({ slug: parsed.data.slug });
    if (existing) return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });

    const category = await Category.create(parsed.data);
    return NextResponse.json({ category: normalizeCategory(category.toObject()) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
