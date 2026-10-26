import { saveCatalogueRecord } from "@/lib/homepage-selection";
import { HOMEPAGE_LIMIT, homepageFilter } from "@/lib/homepage-settings";
import { invalidateCatalogue } from "@/lib/catalogue-cache";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categorySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";
import { normalizeCategory } from "@/lib/data";
import { parsePagination, escapeRegex } from "@/lib/request-params";

export async function GET(request) {
  try {
    await connectDB();
    const params = new URL(request.url).searchParams;
    const query = homepageFilter(params.get("homepage") || "");
    const search = (params.get("search") || "").trim().slice(0, 200);
    if (search) query.$or = ["name", "description"].map(field => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));
    const { page, limit } = parsePagination(params, 15, 100);
    let selection = Category.find(query).sort({ name: 1, _id: 1 });
    if (params.has("page") || params.has("limit")) selection = selection.skip((page - 1) * limit).limit(limit);
    const [categories, total, homepageCount] = await Promise.all([
      selection.lean(), Category.countDocuments(query), Category.countDocuments({ showOnHomepage: true }),
    ]);
    return NextResponse.json({ categories: categories.map(normalizeCategory), total, page, totalPages: Math.ceil(total / limit), homepageCount, homepageLimit: HOMEPAGE_LIMIT }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error.status ? error.message : "Failed to fetch categories" }, { status: error.status || 500 });
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

    const category = await saveCatalogueRecord(Category, parsed.data);
    invalidateCatalogue();
    return NextResponse.json({ category: normalizeCategory(category) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.status ? error.message : "Failed to create category" }, { status: error.status || 500 });
  }
}
