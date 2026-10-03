export const dynamic = "force-dynamic";

import { ProductsCatalogue } from "@/components/site/ProductsCatalogue";
import { getAllCategories, getAllProducts } from "@/lib/data";

export const metadata = {
  title: "Export Products Catalogue",
  description: "Browse our export product catalogue and contact us for pricing, packaging, availability, and international delivery information.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({ searchParams }) {
  const query = await searchParams;
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts({ limit: 200 })]);
  return <ProductsCatalogue initialSearch={query} categories={categories} products={products} />;
}

