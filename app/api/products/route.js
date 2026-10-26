import { saveCatalogueRecord } from "@/lib/homepage-selection";
import { HOMEPAGE_LIMIT, homepageFilter } from "@/lib/homepage-settings";
import { invalidateCatalogue } from "@/lib/catalogue-cache";
import { parsePagination, validObjectId, escapeRegex } from "@/lib/request-params";
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
    const search = (searchParams.get("search") || "").trim().slice(0, 200);
    const sort = searchParams.get("sort") || "newest";

    const query = homepageFilter(searchParams.get("homepage") || "");
    if (category) query.category = await categoryFilter(category);
    if (search) query.$or = ["name", "description"].map(field => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));

    const skip = (page - 1) * limit;
    const sortSpec = sort === "az" ? { name: 1, _id: 1 } : { createdAt: -1, _id: -1 };
    const [products, total, homepageCount] = await Promise.all([
      Product.find(query).populate("category", "name slug image description").sort(sortSpec).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
      Product.countDocuments({ showOnHomepage: true }),
    ]);

    return NextResponse.json({ products: products.map(normalizeProduct), total, page, totalPages: Math.ceil(total / limit), homepageCount, homepageLimit: HOMEPAGE_LIMIT }, { headers: { "Cache-Control": "no-store" } });
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
    const product = await saveCatalogueRecord(Product, parsed.data);
    await Product.populate(product, { path: "category", select: "name slug image description" });
    invalidateCatalogue();
    return NextResponse.json({ product: normalizeProduct(product) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.status ? error.message : "Failed to create product" }, { status: error.status || 500 });
  }
}
