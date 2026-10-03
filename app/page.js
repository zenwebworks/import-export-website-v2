export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Globe2,
  Handshake,
  Leaf,
  MapPinned,
  Package,
  PackageCheck,
  PackageOpen,
  PackageSearch,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { getAllCategories, getHomepageProducts } from "@/lib/data";
import catalogueStyles from "./home-catalogue.module.css";

export const metadata = {
  title: "Global Import and Export Company | Quality Products and Worldwide Trade",
  description:
    "Explore quality export products, international trade solutions, competitive pricing, custom packaging, and reliable worldwide shipping support.",
  alternates: { canonical: "/" },
};

const whyUs = [
  { icon: ShieldCheck, title: "Premium Quality", desc: "Assured products from trusted sources." },
  { icon: CircleDollarSign, title: "Competitive Pricing", desc: "Best prices with transparent quotes." },
  { icon: Globe2, title: "Global Network", desc: "Strong suppliers and buyers worldwide." },
  { icon: Truck, title: "On-Time Delivery", desc: "Timely shipping with careful coordination." },
  { icon: BadgeCheck, title: "Customer Satisfaction", desc: "Clear communication and reliable support." },
  { icon: Handshake, title: "Ethical Business", desc: "Transparent and practical trade practices." },
];

const packagingOptions = [
  { icon: PackageOpen, label: "Pouches" },
  { icon: Boxes, label: "Cartons" },
  { icon: Package, label: "Jars" },
  { icon: Factory, label: "Private Label" },
  { icon: Leaf, label: "Eco Packs" },
  { icon: Warehouse, label: "Bulk Supply" },
];

const exportServices = [
  "Global buyer connection",
  "Product sourcing approach",
  "Quality checking and inspection",
  "Custom packaging and private label",
  "Export pricing and quotation",
  "Buyer coordination",
  "International logistics and shipping",
  "End-to-end export solutions",
];

const importServices = [
  "Global product sourcing",
  "International supplier verification",
  "Product quality inspection",
  "Import documentation support",
  "Customs and port coordination",
  "Transportation in India",
  "Order consolidation",
  "Door-to-door delivery support",
];

const marketLinks = ["Global Link", "Africa", "Europe", "UK", "Southeast Asia", "North America", "Australia", "Other Markets"];

const collaborationPoints = [
  "Export support for small businesses",
  "Global buyer access",
  "Private label and custom packaging",
  "International trade guidance",
  "Logistics and documentation support",
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getAllCategories(),
    getHomepageProducts(12),
  ]);

  return (
    <>
      <HeroCarousel />

      <section id="catalogue" aria-labelledby="featured-categories-heading" className={catalogueStyles.section}>
        <div className={`container-x ${catalogueStyles.sectionLayout}`}>
          <SectionHead
            id="featured-categories-heading"
            eyebrow="Explore our catalogue"
            title="Featured Categories"
            text="Find the right category for your business and explore our export range."
          />
          <Button asChild variant="outline" className={catalogueStyles.browseLink}>
            <Link href="/categories">
              View All Categories <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <div className={catalogueStyles.categoryGrid}>
            {categories.map((category) => (
              <HomeCategoryTile key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="featured-products"
        aria-labelledby="featured-products-heading"
        className={`${catalogueStyles.section} ${catalogueStyles.productsSection}`}
      >
        <div className={`container-x ${catalogueStyles.sectionLayout}`}>
          <SectionHead
            id="featured-products-heading"
            eyebrow="From India to your market"
            title="Featured Export Products"
            text="Explore our selected products and request a quote for your requirements."
          />
          <Button asChild variant="outline" className={catalogueStyles.browseLink}>
            <Link href="/products">
              View All Products <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <div className={catalogueStyles.productGrid}>
            {featured.map((product) => (
              <HomeProductTile key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="container-x scroll-mt-24 py-10 sm:py-12 lg:py-14">
        <div className="overflow-hidden rounded-lg bg-[#071018] text-white shadow-elevated">
          <div className="border-b border-white/10 px-4 py-4 text-center sm:px-6">
            <h2 className="text-xl font-extrabold uppercase tracking-normal sm:text-2xl">
              Why Choose Ramshel Global Trade?
            </h2>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="min-h-[132px] p-4 text-center">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-gold/50 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-[12px] font-extrabold uppercase text-gold">{title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/72">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pb-10 sm:pb-12 lg:pb-14">
        <div className="grid overflow-hidden rounded-lg border border-border bg-white shadow-card-soft lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-5 sm:p-7 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">Packaging Support</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
              Custom Packaging and Private Label
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Build a stronger product presence with custom pouches, cartons, bottles, jars,
              labels and bulk packaging options for export-ready supply.
            </p>

            <ul className="mt-5 grid gap-2 text-sm text-foreground sm:grid-cols-2">
              {[
                "Custom logo and label planning",
                "Retail-ready and bulk packaging",
                "Food-safe packing coordination",
                "Export carton and shipment support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {packagingOptions.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded border border-border bg-surface px-2 py-3 text-center">
                  <Icon className="mx-auto h-5 w-5 text-ocean" />
                  <p className="mt-1.5 text-[11px] font-semibold leading-tight text-navy">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="navy" className="rounded text-xs font-bold uppercase">
                <Link href="/contact">Discuss Requirements</Link>
              </Button>
              <Button asChild variant="outline" className="rounded text-xs font-bold uppercase">
                <Link href="/products">Explore Products</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[260px] border-t border-border lg:min-h-full lg:border-l lg:border-t-0">
            <img
              src="/assets/home-packaging-private-label.png"
              alt="Custom packaging display for export products"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-x pb-10 sm:pb-12 lg:pb-14">
        <div className="grid gap-3 lg:grid-cols-2">
          <TradeServicePanel
            id="export-services"
            title="Export Services"
            subtitle="Connecting Indian businesses to global markets"
            text="We connect Indian manufacturers, suppliers, traders and small businesses with global buyers and markets."
            image="/assets/home-export-services.png"
            cta="Export With Us"
            href="/export-services"
            items={exportServices}
          />
          <TradeServicePanel
            id="import-services"
            title="Import Services"
            subtitle="Sourcing products worldwide to India"
            text="We source products from global markets and support delivery to your destination in India."
            image="/assets/home-import-services.png"
            cta="Import With Us"
            href="/import-services"
            items={importServices}
          />
        </div>
      </section>

      <section className="container-x pb-10 sm:pb-12 lg:pb-14">
        <div className="grid gap-3 lg:grid-cols-[0.82fr_1.18fr]">
          <ImageInfoCard
            title="Global Markets"
            text="Reach buyers, suppliers and distributors across major international trade regions."
            image="/assets/home-global-markets.png"
            href="/contact"
            cta="Explore Markets"
          >
            <div className="mt-5 grid grid-cols-2 gap-2">
              {marketLinks.map((market) => (
                <span key={market} className="flex items-center gap-2 text-xs font-semibold text-white/82">
                  <MapPinned className="h-3.5 w-3.5 shrink-0 text-gold" />
                  {market}
                </span>
              ))}
            </div>
          </ImageInfoCard>

          <ImageInfoCard
            title="Small Business Collaboration"
            text="Taking local businesses to global markets with sourcing, packaging, buyer coordination and export support."
            image="/assets/home-small-business-collaboration.png"
            href="/collaboration"
            cta="Collaborate With Us"
          >
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {collaborationPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-xs font-semibold text-white/82">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </ImageInfoCard>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#071018] text-white">
        <img
          src="/assets/home-global-trade-cta.png"
          alt="Global trade port with cargo ship and cranes"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,18,0.96)_0%,rgba(3,10,18,0.88)_36%,rgba(3,10,18,0.38)_70%,rgba(3,10,18,0.18)_100%)]" />
        <div className="container-x relative py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Global Trade Partnership</p>
            <h2 className="mt-3 text-3xl font-extrabold uppercase leading-tight sm:text-4xl lg:text-5xl">
              Let&apos;s Build Global Trade Together
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/78 sm:text-base">
              Whether you want to export products, import from global markets, source products
              or expand your business worldwide, our team is ready to support you.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="gold" className="rounded text-xs font-extrabold uppercase text-[#071018]">
                <Link href="/request-a-quote">Request a Quote</Link>
              </Button>
              <Button asChild variant="outlineLight" className="rounded text-xs font-extrabold uppercase">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outlineLight" className="rounded text-xs font-extrabold uppercase">
                <Link href="/products">Export With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ id, eyebrow, title, text }) {
  return (
    <div className={catalogueStyles.sectionHeading}>
      <p className={catalogueStyles.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={catalogueStyles.sectionTitle}>{title}</h2>
      <p className={catalogueStyles.sectionDescription}>{text}</p>
    </div>
  );
}

function HomeCategoryTile({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={catalogueStyles.categoryCard}
    >
      <div className={catalogueStyles.categoryImage}>
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={catalogueStyles.imageFallback}>
            <Package aria-hidden="true" />
          </div>
        )}
      </div>
      <div className={catalogueStyles.categoryContent}>
        <h3 className={catalogueStyles.categoryName}>{category.name}</h3>
        <span className={catalogueStyles.categoryArrow} aria-hidden="true">
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

function HomeProductTile({ product }) {
  return (
    <article className={catalogueStyles.productCard}>
      <Link
        href={`/products/${product.slug}`}
        className={catalogueStyles.productImage}
        aria-label={`View ${product.name}`}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={catalogueStyles.imageFallback}>
            <Package aria-hidden="true" />
          </div>
        )}
        {product.featured && (
          <span className={catalogueStyles.featuredBadge}>
            Featured
          </span>
        )}
      </Link>
      <div className={catalogueStyles.productContent}>
        <div className={catalogueStyles.productCategory}>
          {product.category && <p>{product.category.name}</p>}
        </div>
        <h3 className={catalogueStyles.productName}>
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <Button asChild variant="navy" className={catalogueStyles.quoteLink}>
          <Link
            href={`/request-a-quote?product=${encodeURIComponent(product.slug)}`}
            aria-label={`Request a quote for ${product.name}`}
          >
            Get a Quote <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function TradeServicePanel({ id, title, subtitle, text, image, cta, href, items }) {
  return (
    <section id={id} className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#071018] text-white shadow-elevated scroll-mt-24">
      <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,18,0.96)_0%,rgba(3,10,18,0.86)_48%,rgba(3,10,18,0.34)_100%)]" />
      <div className="relative flex min-h-[520px] flex-col justify-between p-5 sm:p-7 lg:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{title}</p>
          <h2 className="mt-2 max-w-md text-2xl font-extrabold uppercase leading-tight sm:text-3xl">{subtitle}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/76">{text}</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <span key={item} className="flex items-center gap-2 text-xs font-semibold text-white/82">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <Button asChild variant="outlineLight" className="mt-8 w-fit rounded text-xs font-extrabold uppercase">
          <Link href={href}>{cta}</Link>
        </Button>
      </div>
    </section>
  );
}

function ImageInfoCard({ title, text, image, href, cta, children }) {
  return (
    <section className="relative min-h-[360px] overflow-hidden rounded-lg bg-[#071018] text-white shadow-card-soft">
      <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,18,0.95)_0%,rgba(3,10,18,0.78)_48%,rgba(3,10,18,0.26)_100%)]" />
      <div className="relative flex min-h-[360px] flex-col justify-between p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-gold sm:text-2xl">{title}</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/76">{text}</p>
          {children}
        </div>
        <Button asChild variant="outlineLight" className="mt-7 w-fit rounded text-xs font-extrabold uppercase">
          <Link href={href}>{cta}</Link>
        </Button>
      </div>
    </section>
  );
}
