"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, Check, CheckCircle2, ChevronDown, PackageSearch, Search, X } from "lucide-react";
import { ProductGrid } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CataloguePagination } from "./CataloguePagination";
import styles from "./products-catalogue.module.css";

export function ProductsCatalogue({ initialSearch = {}, products = [], categories = [], pagination = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const initialQuery = normalizeValue(initialSearch.search || initialSearch.q);
  const [category, setCategory] = useState(normalizeValue(initialSearch.category));
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);

  const filtered = products;
  const [pending, startTransition] = useTransition();

  function updateUrl(nextSearch, nextCategory) {
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextCategory) params.set("category", nextCategory);
    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
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
      <ProductsHero />

      <section id="product-list" aria-label="Product catalogue" className={`container-x py-10 lg:py-14 ${styles.catalogueSection}`}>
        <fieldset disabled={pending} className="min-w-0 border-0 p-0">
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
        </fieldset>
        {pending && <p role="status" className="mt-4 text-sm text-muted-foreground">Updating products…</p>}

        <div aria-busy={pending} className={pending ? "opacity-60" : ""}>
        {filtered.length === 0 ? (
          <EmptyState hasSearch={Boolean(search)} hasCategory={Boolean(category)} onClear={clearAll} />
        ) : (
          <ProductGrid products={filtered} />
        )}
        </div>
        <CataloguePagination path="/products" {...pagination} search={initialQuery} category={normalizeValue(initialSearch.category)} />
      </section>

      <CustomPackaging />
    </>
  );
}

function ProductsHero() {
  const highlights = ["Product sourcing", "Flexible packaging", "Export support"];

  return (
    <section className={styles.hero} aria-labelledby="products-hero-title">
      <div className={styles.heroMedia}>
        <Image
          src="/assets/products-trade-hero-v2.webp"
          alt="Indian spices, rice, nuts, oil and brassware beside a cargo port at sunrise"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </div>
      <div className={`container-x ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>Discover our export collection</p>
          <h1 id="products-hero-title" className={styles.heroTitle}>Our Products</h1>
          <p className={styles.heroSubtitle}>From India. <span>For your market.</span></p>
          <p className={styles.heroDescription}>
            Explore food, natural ingredients and handcrafted goods,
            with sourcing, packaging and export support for your business.
          </p>
          <ul className={styles.heroHighlights}>
            {highlights.map((label) => (
              <li key={label}><Check aria-hidden="true" /><span>{label}</span></li>
            ))}
          </ul>
          <div className={styles.heroActions}>
            <Button asChild variant="gold" size="lg" className={styles.heroButton}>
              <Link href="#product-list">Explore products <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg" className={styles.heroButton}>
              <Link href="/request-a-quote">Request a quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomPackaging() {
  const options = [
    "Branding & label design",
    "Retail pouches & jars",
    "Bulk cartons & sacks",
    "Material & size options",
  ];

  return (
    <section id="custom-packaging" aria-labelledby="custom-packaging-title" className={`container-x ${styles.packagingSection}`}>
      <div className={styles.packagingPanel}>
        <div className={styles.packagingContent}>
          <p className={styles.eyebrow}>Packaging & private label</p>
          <h2 id="custom-packaging-title" className={styles.packagingTitle}>
            Your product.<br />Your brand. Your packaging.
          </h2>
          <p className={styles.packagingDescription}>
            From a retail shelf to a bulk shipment, the right pack makes a
            difference. Let&apos;s plan a packaging format around your product and your market.
          </p>
          <ul className={styles.packagingOptions}>
            {options.map((option) => (
              <li key={option}><CheckCircle2 aria-hidden="true" /><span>{option}</span></li>
            ))}
          </ul>
          <Button asChild variant="navy" className={styles.bannerButton}>
            <Link href="/request-a-quote">Discuss custom packaging <ArrowRight aria-hidden="true" /></Link>
          </Button>
          <p className={styles.packagingNote}>Tell us your pack size, quantity and destination.</p>
        </div>
        <div className={styles.packagingArtwork}>
          <img
            src="/assets/products-custom-packaging.webp"
            alt="Navy and kraft pouches, a spice jar, retail and shipping boxes, and a burlap sack showing packaging options"
            width="1200"
            height="800"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
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
      <form
        onSubmit={onSubmitSearch}
        className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(12rem,18rem)] md:gap-3"
      >
        <div className="relative col-span-2 min-w-0 md:col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search products"
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
        <Button type="submit" variant="navy" className="h-12 rounded-lg px-3 sm:px-6 md:w-36">
          <Search className="h-4 w-4" /> Search
        </Button>
        <div className="relative min-w-0">
          <label htmlFor="product-category-filter" className="sr-only">Filter by category</label>
          <Select
            id="product-category-filter"
            name="category"
            value={activeCategory}
            onChange={(event) => onSelectCategory(event.target.value)}
            className="h-12 min-w-0 cursor-pointer appearance-none truncate rounded-lg border-border bg-surface-muted pl-3 pr-9 text-base text-navy shadow-none hover:border-ocean focus-visible:ring-ocean/40 md:text-sm"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </Select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </form>
    </div>
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
