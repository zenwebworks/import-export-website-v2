import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Globe2, Network, PackageOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { IMPORT_CATEGORIES, IMPORT_MARKETS } from "@/lib/import-services";
import styles from "./import-services.module.css";

const description = "Connect your business in India with global products through trusted sourcing, supplier verification, quality checks, import documentation and shipping support.";

export const metadata = {
  title: "Import Services",
  description,
  alternates: { canonical: "/import-services" },
  openGraph: {
    title: "Import Services — From the World. To India.",
    description,
    url: "/import-services",
    siteName: SITE.name,
    type: "website",
    images: [{ url: "/assets/import-services-hero.webp", width: 1920, height: 640, alt: "A cargo ship connecting global markets with India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Import Services — From the World. To India.",
    description,
    images: ["/assets/import-services-hero.webp"],
  },
};

const services = [
  { icon: PackageOpen, title: "Product Sourcing", description: "We source quality products from trusted suppliers across the globe." },
  { icon: Globe2, title: "Global Supplier Connection", description: "Connecting Indian businesses with verified global suppliers and new opportunities." },
  { icon: Network, title: "Supplier & Manufacturer Network", description: "A strong network of reliable manufacturers and suppliers for your business." },
  { icon: ShieldCheck, title: "Quality & Product Verification", description: "Quality inspection and verification to meet your product specifications." },
  { icon: FileText, title: "Import Pricing & Quotation", description: "Competitive pricing with transparent quotations and a clear cost breakdown." },
];

const additionalServices = [
  { title: "Custom Packaging", image: "/assets/export-custom-packaging.webp", alt: "Protective packaging, pouches and boxes for international trade" },
  { title: "Private Label & Branding", image: "/assets/export-private-label.webp", alt: "Amber jars with blank labels ready for your brand" },
  { title: "Import Documentation", image: "/assets/export-documentation.webp", alt: "A logistics professional reviewing shipping documents" },
  { title: "Logistics & Shipping", image: "/assets/export-logistics.webp", alt: "A cargo ship transporting products between international ports" },
  { title: "Order Management", image: "/assets/export-order-management.webp", alt: "Two trade professionals reviewing a product order" },
];

export default function ImportServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="import-title">
        <div className={styles.heroMedia}>
          <Image
            src="/assets/import-services-hero.webp"
            alt="Aerial view of a cargo ship carrying containers across the ocean"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        </div>
        <div className={`container-x ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}><span aria-hidden="true" /> GLOBAL SOURCING. LOCAL OPPORTUNITIES.</p>
            <h1 id="import-title">Import Services</h1>
            <p className={styles.heroSubtitle}>From the world. <span>To India.</span></p>
            <p className={styles.heroDescription}>End-to-end import solutions that connect<br className={styles.desktopBreak} /> Indian businesses with global products.</p>
            <Button asChild variant="gold" size="lg" className={styles.quoteButton}>
              <Link href="/request-a-quote?service=import">Request a Quote <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <div className={`container-x ${styles.content}`}>
        <section aria-labelledby="our-import-services">
          <div className={styles.sectionHeading}>
            <div className={styles.headingRow}>
              <span aria-hidden="true" />
              <h2 id="our-import-services">Our Import Services</h2>
              <span aria-hidden="true" />
            </div>
            <p>Complete import support for your business growth worldwide.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map(({ icon: Icon, title, description: serviceDescription }) => (
              <article key={title} className={styles.serviceCard}>
                <span className={styles.serviceIcon}><Icon aria-hidden="true" strokeWidth={1.6} /></span>
                <h3>{title}</h3>
                <p>{serviceDescription}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.additionalSection} aria-labelledby="additional-import-services">
          <h2 id="additional-import-services">Additional Services</h2>
          <div className={styles.additionalGrid}>
            {additionalServices.map((service) => (
              <article key={service.title} className={styles.additionalCard}>
                <div className={styles.thumbnail}>
                  <Image src={service.image} alt={service.alt} fill sizes="(max-width: 479px) 92vw, (max-width: 767px) 46vw, (max-width: 1099px) 30vw, 240px" />
                </div>
                <h3>{service.title}</h3>
              </article>
            ))}
          </div>
        </section>
        <div className={styles.detailPanels}>
          <section className={styles.detailPanel} aria-labelledby="import-markets">
            <h2 id="import-markets">Import from Global Markets</h2>
            <span className={styles.panelAccent} aria-hidden="true" />
            <div className={styles.marketsContent}>
              <ul className={styles.marketList}>
                {IMPORT_MARKETS.map((market) => (
                  <li key={market.code}><span aria-hidden="true">{market.code}</span>{market.name}</li>
                ))}
              </ul>
              <div className={styles.marketMap}>
                <Image src="/assets/import-global-markets.webp" alt="Illustrative world map showing an international sourcing network" fill sizes="(max-width: 600px) 90vw, (max-width: 999px) 65vw, 430px" />
              </div>
            </div>
            <p className={styles.marketNote}><Globe2 aria-hidden="true" /> More markets. More possibilities.</p>
          </section>

          <section className={styles.detailPanel} aria-labelledby="import-categories">
            <h2 id="import-categories">Product Categories We Import</h2>
            <span className={styles.panelAccent} aria-hidden="true" />
            <div className={styles.categoryGrid}>
              {IMPORT_CATEGORIES.map((category) => (
                <Link key={category.slug} href={`/request-a-quote?service=import&category=${category.slug}`} className={styles.categoryCard} aria-label={`Enquire about importing ${category.name}`}>
                  <div className={styles.categoryImage}>
                    <Image src={category.image} alt={category.alt} fill sizes="(max-width: 479px) 85vw, (max-width: 600px) 43vw, (max-width: 999px) 29vw, 185px" />
                  </div>
                  <h3>{category.name}</h3>
                </Link>
              ))}
            </div>
            <Button asChild variant="gold" className={styles.moreCategories}>
              <Link href="/request-a-quote?service=import">And Many More Categories <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
