import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, FileText, Globe2, Network, PackageOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import styles from "./export-services.module.css";

const title = "Export Services — From India. To the World.";
const description =
  "Complete export support from India: product sourcing, global buyer connections, supplier verification, quality checks, transparent pricing, packaging and shipping.";

export const metadata = {
  title: "Export Services",
  description,
  alternates: { canonical: "/export-services" },
  openGraph: {
    title,
    description,
    url: "/export-services",
    siteName: SITE.name,
    type: "website",
    images: [{ url: "/assets/export-services-hero.webp", width: 1672, height: 941, alt: "A container ship carrying products across the teal ocean" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/assets/export-services-hero.webp"],
  },
};

const heroBenefits = ["Trusted Sourcing", "Global Network", "Quality Assured", "On-Time Delivery", "End-to-End Support"];

const services = [
  {
    icon: PackageOpen,
    title: "Product Sourcing",
    description: "We source quality products from trusted suppliers across India.",
  },
  {
    icon: Globe2,
    title: "Global Buyer Connection",
    description: "Connecting with international buyers and new business opportunities.",
  },
  {
    icon: Network,
    title: "Supplier & Manufacturer Network",
    description: "A strong network of verified manufacturers and reliable suppliers.",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Product Verification",
    description: "Quality inspection and verification to meet global standards.",
  },
  {
    icon: FileText,
    title: "Export Pricing & Quotation",
    description: "Competitive pricing with transparent quotations and a clear cost breakdown.",
  },
];

const additionalServices = [
  { title: "Custom Packaging", image: "/assets/export-custom-packaging.webp", alt: "Export products in protective boxes, pouches and glass jars" },
  { title: "Private Label & Branding", image: "/assets/export-private-label.webp", alt: "Product packaging with blank labels ready for custom branding" },
  { title: "Export Documentation", image: "/assets/export-documentation.webp", alt: "A logistics professional reviewing export documents at a desk" },
  { title: "Logistics & Shipping", image: "/assets/export-logistics.webp", alt: "Container ship transporting goods to international markets" },
  { title: "Order Management", image: "/assets/export-order-management.webp", alt: "Trade professionals coordinating a product order" },
];

const reasons = [
  "Experienced Export Professionals",
  "On-Time Delivery Assurance",
  "Strong Global Network",
  "Complete Documentation Support",
  "Transparent & Competitive Pricing",
  "Customer-Centric Approach",
];

// Figures supplied in the user's design reference; confirm before public launch.
const statistics = [
  { value: "100", suffix: "+", label: "Products Exported" },
  { value: "50", suffix: "+", label: "Countries Served" },
  { value: "500", suffix: "+", label: "Happy Clients" },
  { value: "99", suffix: "%", label: "On-Time Delivery" },
];

export default function ExportServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="export-title">
        <div className={styles.heroMedia}>
          <Image
            src="/assets/export-services-hero.webp"
            alt="Aerial view of a container ship sailing across the teal ocean"
            fill
            priority
            sizes="(max-width: 600px) 100vw, (max-width: 1440px) 84vw, 1180px"
            className={styles.heroImage}
          />
        </div>
        <div className={`container-x ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}><span /> YOUR PARTNER IN GLOBAL TRADE</p>
            <h1 id="export-title">Export Services</h1>
            <p className={styles.heroSubtitle}>From India. <span>To the world.</span></p>
            <p className={styles.heroDescription}>
              End-to-end export solutions that connect<br className={styles.desktopBreak} /> Indian products with global opportunities.
            </p>
            <ul className={styles.heroBenefits}>
              {heroBenefits.map((benefit) => (
                <li key={benefit}><Check aria-hidden="true" />{benefit}</li>
              ))}
            </ul>
            <Button asChild variant="gold" size="lg" className={styles.quoteButton}>
              <Link href="/request-a-quote">Request a Quote <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <div className={`container-x ${styles.content}`}>
        <section aria-labelledby="our-export-services">
          <div className={styles.sectionHeading}>
            <span className={styles.headingAccent} aria-hidden="true" />
            <h2 id="our-export-services">Our Export Services</h2>
            <p>Complete export support for your business growth worldwide.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map(({ icon: Icon, title: serviceTitle, description: serviceDescription }) => (
              <article key={serviceTitle} className={styles.serviceCard}>
                <span className={styles.serviceIcon}><Icon strokeWidth={1.5} aria-hidden="true" /></span>
                <h3>{serviceTitle}</h3>
                <p>{serviceDescription}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.additionalSection} aria-labelledby="additional-services">
          <div className={styles.additionalHeading}>
            <span aria-hidden="true" />
            <h2 id="additional-services">Additional Services</h2>
            <span aria-hidden="true" />
          </div>
          <div className={styles.additionalGrid}>
            {additionalServices.map((service) => (
              <article key={service.title} className={styles.additionalCard}>
                <div className={styles.thumbnail}>
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 479px) calc(100vw - 32px), (max-width: 767px) 46vw, (max-width: 1099px) 30vw, 240px"
                  />
                </div>
                <h3>{service.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.whySection} aria-labelledby="why-ramshel">
          <div className={styles.whyTop}>
            <div className={styles.whyCopy}>
              <p className={styles.whyEyebrow}>LOCAL EXPERTISE. GLOBAL REACH.</p>
              <h2 id="why-ramshel">Why Choose {SITE.name}?</h2>
              <ul className={styles.reasons}>
                {reasons.map((reason) => (
                  <li key={reason}><Check aria-hidden="true" />{reason}</li>
                ))}
              </ul>
            </div>
            <div className={styles.networkImage} aria-hidden="true">
              <Image src="/assets/export-global-network.webp" alt="" fill sizes="(max-width: 767px) 1px, 380px" />
            </div>
          </div>
          <dl className={styles.statistics}>
            {statistics.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}<span>{stat.suffix}</span></dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={styles.closingCta}>
          <div>
            <h2>Ready to take your business global?</h2>
            <p>Tell us what you need. We’ll help you take the next step.</p>
          </div>
          <Button asChild variant="navy" size="lg" className={styles.contactButton}>
            <Link href="/contact">Let’s Talk Exports <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
