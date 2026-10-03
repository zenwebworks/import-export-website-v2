import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

function serialize(value) {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeCategory(category) {
  if (!category) return null;
  const id = String(category._id || category.id || category.slug);
  const image = category.image || {};
  return {
    ...category,
    id,
    _id: category._id ? String(category._id) : id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    image_url: category.image_url || image.url || "",
    image_public_id: category.image_public_id || image.publicId || "",
    image: {
      url: category.image_url || image.url || "",
      publicId: category.image_public_id || image.publicId || "",
    },
    created_at: category.created_at || category.createdAt || null,
    updated_at: category.updated_at || category.updatedAt || null,
  };
}

export function normalizeProduct(product) {
  if (!product) return null;
  const id = String(product._id || product.id || product.slug);
  const category = normalizeCategory(product.category) || product.category || null;
  const image = product.image || {};
  const categoryId = product.category_id || category?.id || (typeof product.category === "string" ? product.category : "");

  return {
    ...product,
    id,
    _id: product._id ? String(product._id) : id,
    category,
    category_id: categoryId,
    image_url: product.image_url || image.url || "",
    image_public_id: product.image_public_id || image.publicId || "",
    image: {
      url: product.image_url || image.url || "",
      publicId: product.image_public_id || image.publicId || "",
    },
    show_on_homepage: Boolean(product.show_on_homepage ?? product.showOnHomepage),
    showOnHomepage: Boolean(product.showOnHomepage ?? product.show_on_homepage),
    packaging_details: product.packaging_details ?? product.packagingDetails ?? "",
    packagingDetails: product.packagingDetails ?? product.packaging_details ?? "",
    featured: Boolean(product.featured),
    created_at: product.created_at || product.createdAt || null,
    updated_at: product.updated_at || product.updatedAt || null,
  };
}

async function withDatabase(work, emptyValue) {
  try {
    return await work();
  } catch (error) {
    if (!process.env.MONGODB_URI) return emptyValue;
    throw error;
  }
}

export async function getAllCategories() {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Category.find({}).sort({ name: 1 }).lean();
    return serialize(rows).map(normalizeCategory);
  }, []);
}

export async function getCategoryProductCounts() {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    return rows.reduce((counts, row) => {
      counts[String(row._id)] = row.count;
      return counts;
    }, {});
  }, {});
}

export async function getCategoryBySlug(slug) {
  return withDatabase(async () => {
    await connectDB();
    const category = await Category.findOne({ slug }).lean();
    return normalizeCategory(serialize(category));
  }, null);
}

export async function getHomepageProducts(limit = 8) {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Product.find({ showOnHomepage: true })
      .populate("category", "name slug image description")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return serialize(rows).map(normalizeProduct);
  }, []);
}

export async function getAllProducts({ category = "", search = "", featured = "", sort = "newest", limit = 100 } = {}) {
  return withDatabase(async () => {
    await connectDB();
    const query = {};
    if (category) {
      const selected = await Category.findOne({ slug: category }).lean();
      query.category = selected?._id || null;
    }
    if (search) query.$text = { $search: search };
    if (featured === "featured") query.featured = true;
    if (featured === "homepage") query.showOnHomepage = true;

    const sortSpec = sort === "az" ? { name: 1 } : { createdAt: -1 };
    const rows = await Product.find(query).populate("category", "name slug image description").sort(sortSpec).limit(limit).lean();
    return serialize(rows).map(normalizeProduct);
  }, []);
}

export async function getProductBySlug(slug) {
  return withDatabase(async () => {
    await connectDB();
    const product = await Product.findOne({ slug }).populate("category", "name slug image description").lean();
    return normalizeProduct(serialize(product));
  }, null);
}

export async function getProductsByCategorySlug(categorySlug) {
  return withDatabase(async () => {
    await connectDB();
    const category = await Category.findOne({ slug: categorySlug }).lean();
    if (!category) return { category: null, products: [] };
    const products = await Product.find({ category: category._id }).populate("category", "name slug image description").sort({ createdAt: -1 }).lean();
    return { category: normalizeCategory(serialize(category)), products: serialize(products).map(normalizeProduct) };
  }, { category: null, products: [] });
}

export async function getAllSlugs() {
  return withDatabase(async () => {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find({}, "slug updatedAt").lean(),
      Category.find({}, "slug updatedAt").lean(),
    ]);
    return { products: serialize(products), categories: serialize(categories) };
  }, { products: [], categories: [] });
}
