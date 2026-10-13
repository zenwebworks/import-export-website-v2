import { invalidateCatalogue } from "@/lib/catalogue-cache";
import { parsePagination, validObjectId } from "@/lib/request-params";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";
import { normalizeProduct } from "@/lib/data";

async function categoryFilter(value) {
  if (!value) return null;
  const category = await Category.findOne({ $or: [{ slug: value }, { _id: /^[a-f\d]{24}$/i.test(value) ? value : null }] }).lean();
  return category?._id || null;
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePagination(searchParams, 12, 100);
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured") || "";
    const sort = searchParams.get("sort") || "newest";

    const query = {};
    if (category) query.category = await categoryFilter(category);
    if (search) query.$text = { $search: search };
    if (featured === "featured") query.featured = true;
    if (featured === "homepage") query.showOnHomepage = true;

    const skip = (page - 1) * limit;
    const sortSpec = sort === "az" ? { name: 1, _id: 1 } : { createdAt: -1, _id: -1 };
    const [products, total] = await Promise.all([
      Product.find(query).populate("category", "name slug image description").sort(sortSpec).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products: products.map(normalizeProduct), total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: error.status === 400 ? error.message : "Failed to fetch products" }, { status: error.status === 400 ? 400 : 500 });
  }
}

export async function POST(request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });

    await connectDB();
    const existing = await Product.findOne({ slug: parsed.data.slug });
    if (existing) return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });

    if (!validObjectId(parsed.data.category) || !await Category.exists({ _id: parsed.data.category })) return NextResponse.json({ error: "Choose an existing category" }, { status: 400 });
    const product = await Product.create(parsed.data);
    await product.populate("category", "name slug image description");
    invalidateCatalogue();
    return NextResponse.json({ product: normalizeProduct(product.toObject()) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: error.status === 400 ? 400 : 500 });
  }
}
