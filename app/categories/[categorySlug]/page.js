export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { CategoryDetail } from "@/components/site/CategoryDetail";
import { getProductsByCategorySlug } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const { category } = await getProductsByCategorySlug(categorySlug);
  if (!category) return { title: "Category not found", robots: { index: false } };

  return {
    title: `${category.name} - Export Products`,
    description: category.description || `Explore ${category.name} for global export.`,
    alternates: { canonical: `/categories/${categorySlug}` },
  };
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;
  const { category, products } = await getProductsByCategorySlug(categorySlug);

  if (!category) notFound();
  return <CategoryDetail category={category} products={products} />;
}

