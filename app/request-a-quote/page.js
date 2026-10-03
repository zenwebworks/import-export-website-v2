export const dynamic = "force-dynamic";

import { Clock, ShieldCheck, Ship } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { QuoteForm } from "@/components/site/QuoteForm";
import { getAllProducts } from "@/lib/data";
import { IMPORT_CATEGORIES } from "@/lib/import-services";

export async function generateMetadata({ searchParams }) {
  const query = await searchParams;
  const isImport = query?.service === "import";
  return {
    title: isImport ? "Request a Custom Import Quote" : "Request a Custom Export Quote",
    description: isImport
      ? "Tell us the products you want to import, your quantity, source market and delivery location in India. Our team will help with sourcing, pricing and shipping."
      : "Tell us what products you need, your required quantity, destination, and packaging preferences. Our team will contact you with availability and pricing.",
    alternates: { canonical: isImport ? "/request-a-quote?service=import" : "/request-a-quote" },
  };
}

export default async function QuotePage({ searchParams }) {
  const query = await searchParams;
  const isImport = query?.service === "import";
  const category = isImport ? IMPORT_CATEGORIES.find((item) => item.slug === query?.category) : null;
  const product = Array.isArray(query?.product) ? query.product[0] : query?.product ?? "";
  const products = isImport ? [] : await getAllProducts({ limit: 200 });

  return (
    <>
      <section className="bg-gradient-navy text-white">
        <div className="container-x py-12 md:py-16">
          <Breadcrumbs tone="light" items={isImport ? [{ label: "Import Services", href: "/import-services" }, { label: "Request a Quote" }] : [{ label: "Request a Quote" }]} />
          <div className="mt-4 max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">Request a Custom {isImport ? "Import" : "Export"} Quote</h1>
            <p className="mt-4 text-white/85 md:text-lg">{isImport ? "Tell us what you want to import, your quantity, preferred source market and delivery location in India. We’ll help with sourcing, pricing and shipping." : "Tell us what products you need, your required quantity, destination and packaging preferences. Our team will contact you with availability and pricing."}</p>
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft md:p-8">
            <QuoteForm key={`${isImport ? "import" : "export"}:${category?.slug || product}`} defaultProduct={isImport ? "" : product} products={products} service={isImport ? "import" : "export"} importCategory={category?.name || ""} />
          </div>
          <aside className="space-y-4">
            {[
              { icon: Clock, title: "Fast Response", text: "Most quotes returned within 1 business day." },
              { icon: ShieldCheck, title: "No Obligation", text: "Free quotes with transparent pricing and terms." },
              { icon: Ship, title: isImport ? "Global Sourcing, Indian Delivery" : "Worldwide Shipping", text: isImport ? "Support from your supplier’s location to your destination in India." : "FOB, CIF and DDP terms available." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-surface-muted p-5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-navy text-white"><Icon className="h-4.5 w-4.5" /></span>
                <h3 className="mt-4 text-base font-bold text-navy">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}

