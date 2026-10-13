"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CataloguePagination } from "./CataloguePagination";
import { useState, useTransition } from "react";
import { Package, PackageSearch, Search, X } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CTASection } from "@/components/site/CTASection";
import { ProductGrid } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from "./category-detail.module.css";

export function CategoryDetail({ category, products = [], initialSearch = "", pagination = {} }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const search = initialSearch;
  const filtered = products;
  const hasProducts = (pagination.total || 0) > 0 || Boolean(search);
  function navigate(value) {
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    startTransition(() => router.push(`/categories/${category.slug}${params.size ? `?${params}` : ""}`, { scroll: false }));
  }
  function submitSearch(event) { event.preventDefault(); navigate(searchInput.trim()); }
  function clearSearch() { setSearchInput(""); navigate(""); }

  return (
    <>
      <section className={styles.hero} aria-labelledby="category-title">
        <div className="container-x relative grid gap-8 py-12 md:py-20 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <Breadcrumbs tone="light" items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
            <div className="mt-4 max-w-3xl">
              <span className={styles.eyebrow}>Product Category</span>
              <h1 id="category-title" className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{category.name}</h1>
              <p className="mt-4 leading-relaxed text-white/85">{category.description || `Browse export products listed under ${category.name}.`}</p>
              <p className="mt-4 text-sm text-white/70"><span className="font-bold text-gold">{pagination.total ?? products.length}</span> {pagination.total === 1 ? "product" : "products"} {search ? "matching your search" : "currently listed"}</p>
            </div>
          </div>
          <div className={`hidden overflow-hidden rounded-2xl lg:block ${styles.artwork}`}>
            <div className="aspect-square">
              {category.image_url ? (
                <img src={category.image_url} alt={category.name} className="h-full w-full object-contain mix-blend-multiply" />
              ) : (
                <div className="grid h-full w-full place-items-center text-[#0b4248]">
                  <Package className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="product-list" aria-label="Category products" className="container-x py-10 lg:py-14">
        <fieldset disabled={pending} className="min-w-0 border-0 p-0">
        {hasProducts && (
          <CategorySearch
            categoryName={category.name}
            value={searchInput}
            activeSearch={search}
            onChange={setSearchInput}
            onSubmit={submitSearch}
            onClear={clearSearch}
          />
        )}

        </fieldset>
        {pending && <p role="status" className="mt-4 text-sm text-muted-foreground">Updating products…</p>}
        <div aria-busy={pending} className={pending ? "opacity-60" : ""}>
        {!hasProducts ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-navy">No products listed in {category.name} yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add products to this category from the admin dashboard, or request custom sourcing.</p>
            <Button asChild className="mt-5" variant="navy"><Link href="/request-a-quote">Request a Quote</Link></Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-navy">No products match your search</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try another keyword or request a custom quote for this category.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button variant="navy" onClick={clearSearch}>Clear search</Button>
              <Button asChild variant="outline"><Link href="/request-a-quote">Request a Quote</Link></Button>
            </div>
          </div>
        ) : (
          <ProductGrid products={filtered} />
        )}
        </div>
        <CataloguePagination path={`/categories/${category.slug}`} {...pagination} search={search} />
      </section>

      <CTASection />
    </>
  );
}

function CategorySearch({ categoryName, value, activeSearch, onChange, onSubmit, onClear }) {
  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-3 shadow-card-soft sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label={`Search ${categoryName} products`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={`Search ${categoryName} products`}
            className="h-12 rounded-lg border-border bg-surface-muted pl-10 pr-10 shadow-none focus-visible:ring-ocean/40"
          />
          {activeSearch && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-navy"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="navy" className="h-12 rounded-lg px-6 sm:w-36">
          <Search className="h-4 w-4" /> Search
        </Button>
      </div>
    </form>
  );
}
