import { withSocialMetadata } from "@/lib/social";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { CategoryDetail } from "@/components/site/CategoryDetail";
import { getCategoryBySlug, getProductsPage } from "@/lib/data";
import { catalogueParams } from "@/lib/request-params";
import { catalogueMetadata } from "@/lib/seo";

export async function generateMetadata({ params, searchParams }) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  const query = catalogueParams(await searchParams);
  return withSocialMetadata({
    title: `${category.name} - Export Products${query.page > 1 ? ` — Page ${query.page}` : ""}`,
    description: (category.description || `Explore ${category.name} for global export.`).slice(0, 155),
    ...catalogueMetadata(`/categories/${categorySlug}`, { ...query, category: "" }),
  }, { kind: "categories", item: category });
}
export default async function CategoryPage({ params, searchParams }) {
  const { categorySlug } = await params;
  const query = catalogueParams(await searchParams);
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();
  const result = await getProductsPage(categorySlug, query.search, query.page);
  if (query.page > Math.max(1, result.totalPages)) notFound();
  return <CategoryDetail key={JSON.stringify(query)} category={category} products={result.products} initialSearch={query.search} pagination={result} />;
}
