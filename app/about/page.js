import {
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Diamond,
  FileCheck2,
  Globe2,
  Handshake,
  Rocket,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Ramshel Global Trade, our company values, director message, registrations, memberships, and commitment to reliable import export solutions.",
  alternates: { canonical: "/about" },
};

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

const registrations = ["CIN", "PAN", "GST", "IEC", "FSSAI", "MSME", "RCMC", "AD Code", "ICEGATE"];

const memberships = [
  "Export Promotion Council",
  "Chamber of Commerce",
  "Trade Association",
  "Business Network",
  "Industry Association",
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x py-10 sm:py-12 lg:py-14">
        <div className="grid gap-4">
          <article className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)]">
              <div className="p-5 sm:p-7">
                <SectionTitle icon={Building2} title="About Our Company" />
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
                src="/assets/about-company-office.png"
                alt=""
                loading="lazy"
                className="aspect-[16/10] w-full object-cover lg:h-full lg:min-h-[360px] lg:aspect-auto"
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
            <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.58fr)_minmax(0,1fr)]">
              <div className="bg-surface p-4 sm:p-5 lg:p-6">
                <img
                  src="/assets/about-director-placeholder.png"
                  alt="Director placeholder portrait"
                  loading="lazy"
                  className="mx-auto aspect-[4/5] w-full max-w-[360px] rounded-md object-cover object-top lg:h-full lg:max-h-[420px]"
                />
              </div>
              <div className="p-5 sm:p-7">
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
                  <p className="text-sm font-extrabold text-navy">Director Name</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Director, RAMSHEL ENTERPRISES PVT LTD
                  </p>
                </div>
              </div>
            </div>
          </article>
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

      <section className="container-x py-10 sm:py-12 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle icon={FileCheck2} title="Registrations & Licences" />
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              A trade business needs reliable documentation habits. These placeholder tiles can be
              replaced with actual registration and licence files whenever the final documents are ready.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
              {registrations.map((item) => (
                <div key={item} className="rounded-md border border-border bg-white p-3 text-center shadow-card-soft">
                  <FileCheck2 className="mx-auto h-6 w-6 text-ocean" />
                  <p className="mt-2 text-xs font-extrabold uppercase text-navy">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
            <img
              src="/assets/about-registrations-trade.png"
              alt="Trade registrations and international documentation placeholder"
              loading="lazy"
              className="h-full min-h-[300px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-10 sm:py-12 lg:py-14">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <SectionTitle icon={Handshake} title="Memberships & Associations" centered />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We value participation in reputable trade bodies and business networks that support
              ethical, professional and growth-focused global commerce.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {memberships.map((item) => (
              <div key={item} className="rounded-md border border-border bg-surface p-4 text-center">
                <Globe2 className="mx-auto h-7 w-7 text-ocean" />
                <h3 className="mt-3 text-sm font-extrabold text-navy">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ icon: Icon, title, centered = false }) {
  return (
    <div className={centered ? "flex flex-col items-center text-center" : "flex items-center gap-3"}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gold/15 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-xl font-extrabold uppercase text-navy sm:text-2xl">{title}</h2>
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
