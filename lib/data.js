import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CATALOGUE_TAG } from "@/lib/catalogue-cache";
import { escapeRegex } from "@/lib/request-params";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { HOMEPAGE_LIMIT, homepageFilter } from "@/lib/homepage-settings";

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
    showOnHomepage: category.showOnHomepage === true,
    show_on_homepage: category.showOnHomepage === true,
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

async function loadAllCategories() {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Category.find({}).sort({ name: 1, _id: 1 }).lean();
    return serialize(rows).map(normalizeCategory);
  }, []);
}

async function loadCategoryProductCounts() {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    return rows.reduce((counts, row) => {
      counts[String(row._id)] = row.count;
      return counts;
    }, {});
  }, {});
}

async function loadHomepageCategories() {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Category.find({ showOnHomepage: true }).sort({ name: 1, _id: 1 }).limit(HOMEPAGE_LIMIT).lean();
    return serialize(rows).map(normalizeCategory);
  }, []);
}

async function loadCategoryBySlug(slug) {
  return withDatabase(async () => {
    await connectDB();
    const category = await Category.findOne({ slug }).lean();
    return normalizeCategory(serialize(category));
  }, null);
}

async function loadHomepageProducts() {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Product.find({ showOnHomepage: true })
      .populate("category", "name slug image description")
      .sort({ createdAt: -1, _id: -1 })
      .limit(HOMEPAGE_LIMIT)
      .lean();
    return serialize(rows).map(normalizeProduct);
  }, []);
}

async function loadAllProducts({ category = "", search = "", homepage = "", sort = "newest", limit = 100 } = {}) {
  return withDatabase(async () => {
    await connectDB();
    const query = homepageFilter(homepage);
    if (category) {
      const selected = await Category.findOne({ slug: category }).lean();
      query.category = selected?._id || null;
    }
    if (search) query.$text = { $search: search };

    const sortSpec = sort === "az" ? { name: 1 } : { createdAt: -1 };
    const rows = await Product.find(query).populate("category", "name slug image description").sort(sortSpec).limit(limit).lean();
    return serialize(rows).map(normalizeProduct);
  }, []);
}

async function loadProductBySlug(slug) {
  return withDatabase(async () => {
    await connectDB();
    const product = await Product.findOne({ slug }).populate("category", "name slug image description").lean();
    return normalizeProduct(serialize(product));
  }, null);
}

async function loadProductsByCategorySlug(categorySlug) {
  return withDatabase(async () => {
    await connectDB();
    const category = await Category.findOne({ slug: categorySlug }).lean();
    if (!category) return { category: null, products: [] };
    const products = await Product.find({ category: category._id }).populate("category", "name slug image description").sort({ createdAt: -1, _id: -1 }).lean();
    return { category: normalizeCategory(serialize(category)), products: serialize(products).map(normalizeProduct) };
  }, { category: null, products: [] });
}

async function loadAllSlugs() {
  return withDatabase(async () => {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find({}, "slug updatedAt").lean(),
      Category.find({}, "slug updatedAt").lean(),
    ]);
    return { products: serialize(products), categories: serialize(categories) };
  }, { products: [], categories: [] });
}

export const getAllCategories = cache(unstable_cache(loadAllCategories, ["getAllCategories-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getHomepageCategories = cache(unstable_cache(loadHomepageCategories, ["getHomepageCategories-v2"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getCategoryProductCounts = cache(unstable_cache(loadCategoryProductCounts, ["getCategoryProductCounts-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getCategoryBySlug = cache(unstable_cache(loadCategoryBySlug, ["getCategoryBySlug-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getHomepageProducts = cache(unstable_cache(loadHomepageProducts, ["getHomepageProducts-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getAllProducts = cache(unstable_cache(loadAllProducts, ["getAllProducts-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getProductBySlug = cache(unstable_cache(loadProductBySlug, ["getProductBySlug-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getProductsByCategorySlug = cache(unstable_cache(loadProductsByCategorySlug, ["getProductsByCategorySlug-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

export const getAllSlugs = cache(unstable_cache(loadAllSlugs, ["getAllSlugs-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

async function loadProductsPage(categorySlug = "", search = "", page = 1, limit = 12) {
  return withDatabase(async () => {
    await connectDB();
    const query = {};
    if (categorySlug) {
      const selected = await Category.findOne({ slug: categorySlug }).select("_id").lean();
      query.category = selected?._id || null;
    }
    if (search) {
      const literal = escapeRegex(search);
      const matchingCategories = await Category.find({ name: { $regex: literal, $options: "i" } }).select("_id").lean();
      query.$or = ["name", "description", "packagingDetails"].map(field => ({ [field]: { $regex: literal, $options: "i" } }));
      if (matchingCategories.length) query.$or.push({ category: { $in: matchingCategories.map(row => row._id) } });
    }
    const [products, total] = await Promise.all([
      Product.find(query).populate("category", "name slug image description").sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(query),
    ]);
    return { products: serialize(products).map(normalizeProduct), total, page, totalPages: Math.ceil(total / limit) };
  }, { products: [], total: 0, page, totalPages: 0 });
}
export const getProductsPage = cache(unstable_cache(loadProductsPage, ["products-page-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));

async function loadQuoteProductOptions() {
  return withDatabase(async () => {
    await connectDB();
    const rows = await Product.find({}, "name slug").sort({ name: 1, _id: 1 }).lean();
    return serialize(rows).map(row => ({ ...row, id: String(row._id) }));
  }, []);
}
export const getQuoteProductOptions = cache(unstable_cache(loadQuoteProductOptions, ["quote-product-options-v1"], { tags: [CATALOGUE_TAG], revalidate: 300 }));
