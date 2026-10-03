"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PackageSearch, Search, X } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductsCatalogue({ initialSearch = {}, products = [], categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const initialQuery = normalizeValue(initialSearch.search || initialSearch.q);
  const [category, setCategory] = useState(normalizeValue(initialSearch.category));
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);

  const filtered = useMemo(() => {
    let list = products;
    const needle = search.toLowerCase().trim();

    if (needle) {
      list = list.filter((product) =>
        [product.name, product.description, product.category?.name, product.packaging_details]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      );
    }

    if (category) list = list.filter((product) => product.category?.slug === category);
    return list;
  }, [category, products, search]);

  function updateUrl(nextSearch, nextCategory) {
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextCategory) params.set("category", nextCategory);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function submitSearch(event) {
    event.preventDefault();
    const nextSearch = searchInput.trim();
    setSearch(nextSearch);
    updateUrl(nextSearch, category);
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    updateUrl("", category);
  }

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    updateUrl(search, nextCategory);
  }

  function clearAll() {
    setSearchInput("");
    setSearch("");
    setCategory("");
    updateUrl("", "");
  }

  return (
    <>
      <section className="bg-gradient-navy text-white">
        <div className="container-x py-12 md:py-16">
          <Breadcrumbs tone="light" items={[{ label: "Products" }]} />
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Explore Our Export Products</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Browse our product catalogue and contact us for pricing, packaging, availability, and international delivery information.
          </p>
        </div>
      </section>

      <section className="container-x py-10 lg:py-14">
        <ProductControls
          searchInput={searchInput}
          activeSearch={search}
          activeCategory={category}
          categories={categories}
          onSearchInput={setSearchInput}
          onSubmitSearch={submitSearch}
          onClearSearch={clearSearch}
          onSelectCategory={selectCategory}
        />

        {filtered.length === 0 ? (
          <EmptyState hasSearch={Boolean(search)} hasCategory={Boolean(category)} onClear={clearAll} />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </>
  );
}

function ProductControls({
  searchInput,
  activeSearch,
  activeCategory,
  categories,
  onSearchInput,
  onSubmitSearch,
  onClearSearch,
  onSelectCategory,
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-card-soft sm:p-4">
      <form onSubmit={onSubmitSearch} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => onSearchInput(event.target.value)}
            placeholder="Enter product name, category, or packaging"
            className="h-12 rounded-lg border-border bg-surface-muted pl-10 pr-10 shadow-none focus-visible:ring-ocean/40"
          />
          {activeSearch && (
            <button
              type="button"
              onClick={onClearSearch}
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
      </form>

      <div className="mt-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-2">
          <CategoryPill active={!activeCategory} onClick={() => onSelectCategory("")}>All</CategoryPill>
          {categories.map((cat) => (
            <CategoryPill key={cat.id} active={activeCategory === cat.slug} onClick={() => onSelectCategory(cat.slug)}>
              {cat.name}
            </CategoryPill>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "border-navy bg-navy text-white shadow-card-soft"
          : "border-border bg-background text-muted-foreground hover:border-ocean hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ hasSearch, hasCategory, onClear }) {
  const title = hasSearch || hasCategory ? "No matching products" : "No products listed yet";
  const text = hasSearch || hasCategory
    ? "Try another search term, choose a different category, or request a custom quote."
    : "Products added from the admin dashboard will appear here.";

  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
      <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {(hasSearch || hasCategory) && <Button variant="navy" onClick={onClear}>Clear search and filters</Button>}
        <Button asChild variant="outline"><Link href="/request-a-quote">Request custom quote</Link></Button>
      </div>
    </div>
  );
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
