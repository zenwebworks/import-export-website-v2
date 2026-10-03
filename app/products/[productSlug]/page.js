export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Boxes, MessageCircle, MessageSquare, Package2, Phone, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductEnquiryForm } from "@/components/site/ProductEnquiryForm";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/data";
import { SITE, waLink } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) return { title: "Product not found", robots: { index: false } };

  return {
    title: product.name,
    description: (product.description || `Buy ${product.name} for international export.`).slice(0, 155),
    alternates: { canonical: `/products/${productSlug}` },
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
    twitter: product.image_url ? { images: [product.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: product.image_url || undefined, category: product.category?.name }) }} />

      <section className="border-b border-border bg-surface-muted">
        <div className="container-x py-6">
          <Breadcrumbs items={[{ label: "Products", href: "/products" }, ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }] : []), { label: product.name }]} />
        </div>
      </section>

      <section className="container-x py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
            {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center bg-gradient-ocean text-white"><Package2 className="h-16 w-16" /></div>}
          </div>

          <div>
            {product.category && <Link href={`/categories/${product.category.slug}`} className="text-xs font-semibold uppercase tracking-wider text-ocean hover:text-navy">{product.category.name}</Link>}
            <h1 className="mt-2 text-3xl font-bold leading-tight text-navy md:text-4xl">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {product.featured && <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-foreground/90"><Star className="h-3 w-3 text-gold" /> Featured Product</span>}
              {product.show_on_homepage && <span className="rounded-full border border-navy/10 bg-navy/5 px-3 py-1 text-xs font-semibold text-navy">Popular Export</span>}
            </div>
            <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
            {product.packaging_details && (
              <div className="mt-6 flex gap-3 rounded-xl border border-border bg-card p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-ocean"><Boxes className="h-4 w-4" /></span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Packaging Details</p>
                  <p className="mt-0.5 whitespace-pre-line text-sm text-navy">{product.packaging_details}</p>
                </div>
              </div>
            )}
            <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button asChild variant="gold" size="lg"><Link href={`/request-a-quote?product=${encodeURIComponent(product.slug)}`}><MessageSquare className="h-4 w-4" /> Request a Quote</Link></Button>
              <Button asChild variant="navy" size="lg"><a href={waLink(`Hello, I'd like to enquire about "${product.name}".`)} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4" /> WhatsApp</a></Button>
              <Button asChild variant="outline" size="lg"><a href={SITE.phoneHref}><Phone className="h-4 w-4" /> Call Supplier</a></Button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-navy">Product Overview</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description || "Contact our export team for full product details."}</p>
            <p className="mt-6 text-xs italic text-muted-foreground">Disclaimer: packaging and availability may change based on order requirements. Please confirm final details with our export team.</p>
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card-soft lg:sticky lg:top-24">
            <h3 className="text-lg font-bold text-navy">Send a Product Enquiry</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get a customised quote for {product.name}.</p>
            <div className="mt-5"><ProductEnquiryForm productName={product.name} productId={product._id || product.id} /></div>
          </aside>
        </div>
      </section>
    </>
  );
}

