import { withSocialMetadata } from "@/lib/social";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ProductPackaging } from "@/components/site/ProductPackaging";
import { ProductsCatalogue } from "@/components/site/ProductsCatalogue";
import { getAllCategories, getProductsPage } from "@/lib/data";
import { catalogueParams } from "@/lib/request-params";
import { catalogueMetadata } from "@/lib/seo";

export async function generateMetadata({ searchParams }) {
  const query = catalogueParams(await searchParams);
  return withSocialMetadata({
    title: `Export Products Catalogue${query.page > 1 ? ` — Page ${query.page}` : ""}`,
    description: "Browse our export product catalogue and contact us for pricing, packaging, availability, and international delivery information.",
    ...catalogueMetadata("/products", query),
  });
}
export default async function ProductsPage({ searchParams }) {
  const query = catalogueParams(await searchParams);
  const [categories, result] = await Promise.all([getAllCategories(), getProductsPage(query.category, query.search, query.page)]);
  if (query.page > Math.max(1, result.totalPages)) notFound();
  return (
    <>
      <ProductsCatalogue key={JSON.stringify(query)} initialSearch={query} categories={categories} products={result.products} pagination={result} />
      <ProductPackaging />
    </>
  );
}
