import { withSocialMetadata } from "@/lib/social";
import {
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Diamond,
  Handshake,
  Rocket,
  Scale,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

export const metadata = withSocialMetadata({
  title: "About Us",
  description:
    "Learn about Ramshel Global Trade, our company values, director message, registrations, memberships, and commitment to reliable import export solutions.",
  alternates: { canonical: "/about" },
});

const companyFacts = [
  ["Company Name", "RAMSHEL ENTERPRISES PVT LTD"],
  ["Trade Brand", "RAMSHEL GLOBAL TRADE"],
  ["Business", "Import, Export and Global Trade"],
  ["Country of Origin", "India"],
  ["Company Type", "Private Limited Company"],
];

const visionPoints = [
  "Build long-term global partnerships",
  "Create value through trust and quality",
  "Expand a reliable business network",
];

const missionPoints = [
  "Deliver professional trade solutions",
  "Connect reliable suppliers and buyers",
  "Ensure transparent communication",
  "Maintain quality and reliability",
  "Support global business growth",
];

const values = [
  { icon: ShieldCheck, label: "Trust & Integrity" },
  { icon: BadgeCheck, label: "Quality Commitment" },
  { icon: Users, label: "Customer Satisfaction" },
  { icon: ClipboardCheck, label: "Professionalism" },
  { icon: Handshake, label: "Responsibility" },
];

// Temporarily keep the advisor section and its image off the public page.
const SHOW_LEGAL_ADVISOR = false;

export default function AboutPage() {
  return (
    <>
      <section className="container-x py-10 sm:py-12 lg:py-14">
        <div className="grid gap-4">
          <article className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)]">
              <div className="p-5 sm:p-7">
                <SectionTitle as="h1" icon={Building2} title="About Our Company" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  We are committed to professional trade coordination, quality-focused sourcing and
                  dependable support for partners across global markets.
                </p>
                <div className="mt-5 divide-y divide-border overflow-hidden rounded-md border border-border">
                  {companyFacts.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[0.42fr_0.58fr] gap-3 bg-white px-3 py-2.5 text-xs sm:text-sm">
                      <span className="font-semibold text-muted-foreground">{label}</span>
                      <span className="font-bold text-navy">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <img
                src="/assets/about-company-ramshel-reception.jpeg"
                alt="Ramshel Global Trade reception with a gold world map above the company logo"
                width={1536}
                height={1024}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover lg:h-full lg:min-h-[360px] lg:aspect-auto"
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
            <div className="grid gap-0 md:grid-cols-[minmax(240px,0.58fr)_minmax(0,1fr)]">
              <div className="flex items-center justify-center bg-surface p-4 sm:p-5 lg:p-6">
                <img
                  src="/assets/about-director.jpeg"
                  alt="Director of Ramshel Enterprises"
                  width={1086}
                  height={1448}
                  loading="lazy"
                  className="aspect-[3/4] w-full max-w-[240px] rounded-md object-cover lg:max-w-[280px]"
                />
              </div>
              <div className="min-w-0 self-center p-5 sm:p-7">
                <SectionTitle icon={Award} title="Our Director" />
                <h2 className="mt-4 text-xl font-extrabold text-navy">Director&apos;s Message</h2>
                <blockquote className="mt-4 border-l-4 border-gold pl-4 text-sm font-medium leading-relaxed text-muted-foreground">
                  Our vision is to create value for customers and partners by providing reliable
                  trade solutions and building strong relationships across the globe.
                </blockquote>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  We believe in transparency, quality service and ethical business practices across
                  every import and export relationship.
                </p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Director, RAMSHEL ENTERPRISES PVT LTD
                  </p>
                </div>
              </div>
            </div>
          </article>

          {SHOW_LEGAL_ADVISOR && <article className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
            <div className="grid gap-0 md:grid-cols-[minmax(240px,0.58fr)_minmax(0,1fr)]">
              <div className="flex items-center justify-center bg-surface p-4 sm:p-5 lg:p-6">
                <img
                  src="/assets/about-director-placeholder.png"
                  alt="Legal advisor of Ramshel Enterprises"
                  width={1122}
                  height={1402}
                  loading="lazy"
                  className="aspect-[3/4] w-full max-w-[240px] rounded-md object-cover object-top lg:max-w-[280px]"
                />
              </div>
              <div className="min-w-0 self-center p-5 sm:p-7">
                <SectionTitle icon={Scale} title="Our Legal Advisor" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Legal guidance supports our commitment to transparent, responsible business
                  practices and trusted relationships with our trade partners.
                </p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Legal Advisor, RAMSHEL ENTERPRISES PVT LTD
                  </p>
                </div>
              </div>
            </div>
          </article>}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-10 sm:py-12 lg:py-14">
        <div className="container-x grid gap-4 lg:grid-cols-[1fr_1fr_0.8fr]">
          <InfoPanel
            icon={Target}
            title="Our Vision"
            text="To become a trusted bridge between Indian businesses and global markets."
            items={visionPoints}
          />
          <InfoPanel
            icon={Rocket}
            title="Our Mission"
            text="To simplify international trade with practical, professional and dependable support."
            items={missionPoints}
          />
          <article className="rounded-md border border-border bg-white p-5 shadow-card-soft sm:p-6">
            <SectionTitle icon={Diamond} title="Our Values" />
            <ul className="mt-5 grid gap-3">
              {values.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-bold text-navy">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-gold/15 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="container-x py-10 sm:py-12 lg:py-14" aria-label="Registrations and trade associations">
        <div className="grid gap-6 lg:grid-cols-2">
          <CredentialPanel
            id="registrations"
            title="Registrations & Licences"
            image="/assets/about-registrations-logos.webp"
            alt="CIN, PAN, GSTIN, IEC, FSSAI, MSME, RCMC, AD Code and ICEGATE"
          />
          <CredentialPanel
            id="memberships"
            title="Memberships & Associations"
            image="/assets/about-memberships-logos.webp"
            alt="FIEO, APEDA, DGFT, FSSAI, Chambers of Commerce, Export Promotion Councils and Trade Associations"
          />
        </div>
      </section>
    </>
  );
}

function SectionTitle({ icon: Icon, title, centered = false, as: Heading = "h2" }) {
  return (
    <div className={centered ? "flex flex-col items-center text-center" : "flex items-center gap-3"}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gold/15 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <Heading className="text-xl font-extrabold uppercase text-navy sm:text-2xl">{title}</Heading>
    </div>
  );
}

function InfoPanel({ icon: Icon, title, text, items }) {
  return (
    <article className="rounded-md border border-border bg-white p-5 shadow-card-soft sm:p-6">
      <SectionTitle icon={Icon} title={title} />
      <p className="mt-4 text-sm font-semibold leading-relaxed text-navy">{text}</p>
      <ul className="mt-5 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CredentialPanel({ id, title, image, alt }) {
  return (
    <article aria-labelledby={`${id}-heading`} className="min-w-0 overflow-hidden rounded-xl border border-gold/30 bg-[#fffdf7] shadow-card-soft">
      <div className="border-b border-gold/20 px-5 py-5 sm:px-6">
        <h2 id={`${id}-heading`} className="text-lg font-extrabold text-navy sm:text-xl">{title}</h2>
      </div>
      <img src={image} alt={alt} width={1536} height={1024} loading="lazy" decoding="async" className="block h-auto w-full" />
    </article>
  );
}
