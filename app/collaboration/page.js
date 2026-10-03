import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Factory,
  FileCheck2,
  Globe2,
  Handshake,
  Headset,
  Network,
  SearchCheck,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Truck,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import styles from "./collaboration.module.css";

const description = "Build stronger global trade partnerships with Ramshel: business collaboration, supplier relationships, distributor networks, product development and joint ventures.";

export const metadata = {
  title: "Collaboration",
  description,
  alternates: { canonical: "/collaboration" },
  openGraph: {
    title: "Collaborate. Connect. Grow Together.",
    description,
    url: "/collaboration",
    siteName: SITE.name,
    type: "website",
    images: [{ url: "/assets/collaboration-hero.webp", width: 1920, height: 640, alt: "Business partnership connecting global markets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collaborate. Connect. Grow Together.",
    description,
    images: ["/assets/collaboration-hero.webp"],
  },
};

const partnershipValues = [
  { icon: Globe2, firstLine: "Global", secondLine: "Network" },
  { icon: ShieldCheck, firstLine: "Trust &", secondLine: "Transparency" },
  { icon: Handshake, firstLine: "Strong", secondLine: "Partnerships" },
  { icon: ChartNoAxesCombined, firstLine: "Mutual", secondLine: "Growth" },
];

const services = [
  { number: "01", icon: UsersRound, title: "Business Partnership", description: "We build strategic partnerships to explore new opportunities and expand global reach." },
  { number: "02", icon: Factory, title: "Supplier Collaboration", description: "We collaborate with trusted suppliers to ensure quality, reliability and consistency." },
  { number: "03", icon: Network, title: "Distributor & Agent Network", description: "Join our global network of distributors and agents to represent quality products in your region." },
  { number: "04", icon: Settings2, title: "Co-development & Customization", description: "We work together to develop customized solutions and products that meet local market needs." },
  { number: "05", icon: TrendingUp, title: "Investment & Joint Ventures", description: "Explore investment opportunities and joint ventures for sustainable business growth." },
];

const supportServices = [
  { icon: SearchCheck, title: "Market Research & Analysis", image: "/assets/collaboration-market-research.webp", alt: "Business professionals discussing market research and charts" },
  { icon: UsersRound, title: "Project Planning & Consultation", image: "/assets/collaboration-project-planning.webp", alt: "Consultants reviewing a project plan and printed charts" },
  { icon: Truck, title: "Logistics & Supply Chain Support", image: "/assets/collaboration-logistics.webp", alt: "A freight truck and shipping containers at a modern port" },
  { icon: FileCheck2, title: "Legal & Documentation Support", image: "/assets/export-documentation.webp", alt: "A professional carefully reviewing business documents" },
  { icon: Headset, title: "Dedicated Relationship Management", image: "/assets/collaboration-relationship-management.webp", alt: "Two business support professionals assisting customers" },
];

export default function CollaborationPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="collaboration-title">
        <div className={styles.heroMedia}>
          <Image
            src="/assets/collaboration-hero.webp"
            alt="A business handshake with a global trade map and city skyline in the background"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        </div>
        <div className={`container-x ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <h1 id="collaboration-title">Collaborate.<br />Connect.<br /><span>Grow together.</span></h1>
            <p className={styles.heroDescription}>Stronger partnerships. Global trade solutions.<br className={styles.desktopBreak} /> Shared growth, worldwide.</p>
            <Button asChild variant="navy" size="lg" className={styles.startButton}>
              <Link href="/contact#business-enquiry">Get Started <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <ul className={styles.partnershipValues} aria-label="Our partnership values">
              {partnershipValues.map(({ icon: Icon, firstLine, secondLine }) => (
                <li key={firstLine}>
                  <Icon aria-hidden="true" strokeWidth={1.6} />
                  <span>{firstLine}<br />{secondLine}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={`container-x ${styles.content}`}>
        <section aria-labelledby="collaboration-services">
          <div className={styles.sectionHeading}>
            <div className={styles.headingRow}>
              <span aria-hidden="true" />
              <h2 id="collaboration-services">Our Collaboration Services</h2>
              <span aria-hidden="true" />
            </div>
            <p>Building strong partnerships for a successful future.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map(({ number, icon: Icon, title, description: serviceDescription }) => (
              <article key={number} className={styles.serviceCard}>
                <span className={styles.serviceNumber} aria-hidden="true">{number}</span>
                <span className={styles.serviceIcon}><Icon aria-hidden="true" strokeWidth={1.7} /></span>
                <h3>{title}</h3>
                <p>{serviceDescription}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.supportSection} aria-labelledby="collaboration-support">
          <div className={`${styles.headingRow} ${styles.supportHeading}`}>
            <span aria-hidden="true" />
            <h2 id="collaboration-support">Additional Support We Provide</h2>
            <span aria-hidden="true" />
          </div>
          <div className={styles.supportGrid}>
            {supportServices.map(({ icon: Icon, title, image, alt }) => (
              <article key={title} className={styles.supportCard}>
                <div className={styles.supportImage}>
                  <Image src={image} alt={alt} fill sizes="(max-width: 479px) 92vw, (max-width: 767px) 46vw, (max-width: 1099px) 46vw, 240px" />
                </div>
                <div className={styles.supportCaption}>
                  <Icon aria-hidden="true" strokeWidth={1.5} />
                  <h3>{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
