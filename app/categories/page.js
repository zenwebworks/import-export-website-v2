import { withSocialMetadata } from "@/lib/social";
export const dynamic = "force-dynamic";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryCard } from "@/components/site/CategoryCard";
import { getAllCategories, getCategoryProductCounts } from "@/lib/data";

export const metadata = withSocialMetadata({
  title: "Product Categories",
  description: "Explore product categories from Ramshel Global Trade: agricultural products, spices, textiles, industrial goods, handicrafts and packaging.",
  alternates: { canonical: "/categories" },
});

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([getAllCategories(), getCategoryProductCounts()]);

  return (
    <>
      <section className="bg-gradient-navy text-white">
        <div className="container-x py-12 md:py-16">
          <Breadcrumbs tone="light" items={[{ label: "Categories" }]} />
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Product Categories</h1>
          <p className="mt-3 max-w-2xl text-white/80">Explore our full range of export categories - from agricultural commodities to packaging materials.</p>
        </div>
      </section>
      <section aria-label="Product categories" className="container-x py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => <CategoryCard key={category.id} category={category} productCount={counts[category.id] ?? 0} />)}
        </div>
      </section>
    </>
  );
}

