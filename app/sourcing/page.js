import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Factory,
  MapPin,
  MessageSquareText,
  Network,
  PackageCheck,
  Search,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Store,
  Truck,
  UserCheck,
  Users,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Global Sourcing Services",
  description:
    "Source reliable products from India with supplier search, verification, quality assurance, packaging support, logistics coordination and global trade guidance.",
  alternates: { canonical: "/sourcing" },
};

const sourcingServices = [
  { icon: Factory, label: "Manufacturer Sourcing" },
  { icon: Network, label: "Supplier Network" },
  { icon: Search, label: "Product Matching" },
  { icon: CircleDollarSign, label: "Price Procurement" },
  { icon: PackageCheck, label: "Export-Ready Products" },
];

const sourceCategories = [
  { image: "/assets/sourcing-category-spices-pulses.png", title: "Spices & Pulses" },
  { image: "/assets/sourcing-category-food-agriculture.png", title: "Food & Agriculture" },
  { image: "/assets/sourcing-category-fresh-vegetables.png", title: "Fresh & Vegetables" },
  { image: "/assets/sourcing-category-dried-foods-nuts.png", title: "Dried Foods & Nuts" },
  { image: "/assets/sourcing-category-herbs-superfoods.png", title: "Herbs & Superfoods" },
  { image: "/assets/sourcing-category-oils.png", title: "Oils" },
  { image: "/assets/sourcing-category-handicrafts.png", title: "Handicrafts" },
  { image: "/assets/sourcing-category-metal-products.png", title: "Metal Products" },
  { image: "/assets/sourcing-category-custom-requirements.png", title: "Custom Requirements" },
];

const sourcingSteps = [
  { icon: ClipboardList, title: "Tell Us Your Requirement", text: "Product, quantity, specifications and destination." },
  { icon: Search, title: "Supplier Search", text: "We identify suitable manufacturers and suppliers." },
  { icon: ShieldCheck, title: "Supplier Verification", text: "We evaluate supplier capability and reliability." },
  { icon: CircleDollarSign, title: "Product & Price Evaluation", text: "Compare specifications, quality and commercial terms." },
  { icon: ClipboardCheck, title: "Quality Checking", text: "Product inspection according to requirements." },
  { icon: BadgeCheck, title: "Sample / Approval", text: "Samples can be arranged where applicable." },
  { icon: PackageCheck, title: "Packaging & Private Label", text: "Custom packaging as per brand requirements." },
  { icon: MapPin, title: "Order Confirmation", text: "Finalize quantity, pricing and terms." },
  { icon: Truck, title: "Logistics & Shipping", text: "Coordinate export logistics and international shipping." },
  { icon: MessageSquareText, title: "Delivery", text: "Support the shipment through the agent destination." },
];

const supplierChecks = [
  "Manufacturer identification",
  "Supplier background review",
  "Production capability",
  "Product specifications",
  "Quality standards",
  "Packaging capability",
  "Order capacity",
  "Export readiness",
];

const qualityChecks = [
  "Product quality verification",
  "Specification checking",
  "Sample evaluation",
  "Packaging inspection",
  "Quantity verification",
  "Pre-shipment inspection support",
  "Export standard requirements",
];

const customSourcing = [
  "Product name",
  "Specifications",
  "Quality",
  "Quantity",
  "Budget",
  "Packaging",
  "Brand / Private Label",
  "Destination country",
];

const businessTypes = [
  { icon: Ship, label: "Importers" },
  { icon: Truck, label: "Exporters" },
  { icon: Network, label: "Wholesalers" },
  { icon: Users, label: "Distributors" },
  { icon: Store, label: "Retailers" },
  { icon: Factory, label: "Manufacturers" },
  { icon: Utensils, label: "Restaurants & Food Businesses" },
  { icon: UserCheck, label: "Small Business Owners" },
  { icon: ShoppingBag, label: "Emerging Brands" },
];

const markets = [
  "Middle East",
  "Africa",
  "Europe",
  "United Kingdom",
  "Southeast Asia",
  "North America",
  "Australia",
  "Other International Markets",
];

export default function SourcingPage() {
  return (
    <>
      <section className="container-x py-10 sm:py-12 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.98fr]">
          <article className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
            <div className="grid gap-0">
              <img
                src="/assets/sourcing-partner.png"
                alt="Global sourcing partnership"
                className="aspect-[16/9] w-full object-cover object-center"
                fetchPriority="high"
              />
              <div className="p-5 sm:p-7">
                <SectionTitle title="About Our Sourcing Service" />
                <h1 className="mt-5 text-2xl font-extrabold uppercase leading-tight text-navy sm:text-3xl">
                  Your Global Sourcing Partner
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  We source quality products from reliable manufacturers and suppliers according to your
                  requirements, covering quality standards, packaging, pricing and export readiness.
                </p>
                <ul className="mt-5 grid gap-3">
                  {sourcingServices.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-sm font-bold text-navy">
                      <Icon className="h-4 w-4 shrink-0 text-gold" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="rounded-md border border-border bg-white p-5 shadow-card-soft sm:p-7">
            <SectionTitle title="What We Source" />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sourceCategories.map(({ image, title }) => (
                <div key={title} className="rounded-md border border-border bg-white p-3 text-center shadow-card-soft">
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-md bg-surface sm:h-24 sm:w-24 lg:h-20 lg:w-20 xl:h-24 xl:w-24">
                    <img src={image} alt={`${title} sourcing category`} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <p className="grid min-h-[44px] place-items-center px-2 py-2 text-xs font-extrabold leading-tight text-navy">
                    {title}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="navy" className="rounded-md text-xs font-extrabold uppercase">
                <Link href="/products">View Products</Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-10 sm:py-12 lg:py-14">
        <div className="container-x">
          <div className="flex flex-col gap-2 text-center">
            <SectionTitle title="Our Sourcing Process" centered />
            <h2 className="text-2xl font-extrabold uppercase text-navy sm:text-3xl">How Our Sourcing Works</h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {sourcingSteps.map(({ icon: Icon, title, text }) => (
              <article key={title} className="relative rounded-md border border-border bg-white p-4 shadow-card-soft">
                <Icon className="h-8 w-8 text-navy" />
                <h3 className="mt-4 min-h-[40px] text-sm font-extrabold leading-tight text-navy">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-10 sm:py-12 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-3">
          <ChecklistImageCard
            title="Supplier Verification"
            subtitle="Reliable Supplier Network"
            image="/assets/sourcing-supplier-verification.png"
            items={supplierChecks}
          />
          <ChecklistImageCard
            title="Quality Assurance"
            subtitle="Quality-Focused Sourcing"
            image="/assets/sourcing-quality-assurance.png"
            items={qualityChecks}
          />
          <article className="rounded-md border border-border bg-white p-5 shadow-card-soft sm:p-6">
            <SectionTitle title="Custom Product Sourcing" />
            <h3 className="mt-4 text-base font-extrabold uppercase text-navy">Can&apos;t Find The Product You Need?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tell us your requirement and we will search for suitable suppliers and products.
            </p>
            <p className="mt-5 text-sm font-extrabold text-navy">We can source based on:</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {customSourcing.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
            <Button asChild variant="navy" className="mt-7 w-full rounded-md text-xs font-extrabold uppercase">
              <Link href="/request-a-quote">Submit Sourcing Requirement</Link>
            </Button>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-white py-10 sm:py-12 lg:py-14">
        <div className="container-x grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-md border border-border bg-white p-5 shadow-card-soft sm:p-7">
            <SectionTitle title="Sourcing For Businesses" />
            <h2 className="mt-4 text-xl font-extrabold uppercase text-navy">Solutions For Every Business</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {businessTypes.map(({ icon: Icon, label }) => (
                <div key={label} className="grid min-h-[108px] place-items-center rounded-md border border-border bg-surface p-3 text-center">
                  <Icon className="h-7 w-7 text-navy" />
                  <p className="mt-2 text-xs font-bold leading-tight text-navy">{label}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-border bg-surface p-5 shadow-card-soft sm:p-7">
            <SectionTitle title="Global Sourcing Markets" />
            <h2 className="mt-4 text-xl font-extrabold uppercase text-navy">
              Connecting Global Buyers With Indian Suppliers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Serving sourcing requirements in:</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {markets.map((market) => (
                <CheckItem key={market}>{market}</CheckItem>
              ))}
            </ul>
            <div className="mt-7 overflow-hidden rounded-md border border-border bg-white p-3 sm:p-4">
              <img
                src="/assets/sourcing-global-markets-map.png"
                alt="World map highlighting global sourcing markets"
                loading="lazy"
                className="mx-auto aspect-[16/8] w-full rounded-md object-contain"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="navy" className="rounded-md text-xs font-extrabold uppercase">
                <Link href="/contact">
                  Explore Global Markets <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="container-x py-10 sm:py-12 lg:py-14">
        <div className="relative overflow-hidden rounded-md bg-[#071018] text-white shadow-elevated">
          <img
            src="/assets/sourcing-cta-port.png"
            alt="Container ship and port logistics"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,18,0.96)_0%,rgba(3,10,18,0.82)_42%,rgba(3,10,18,0.26)_100%)]" />
          <div className="relative max-w-2xl p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Start Sourcing</p>
            <h2 className="mt-3 text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
              Let Us Source The Right Product For You
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/78 sm:text-base">
              Tell us your requirement. We will connect you with suitable sourcing opportunities from India.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="gold" className="rounded-md text-xs font-extrabold uppercase text-[#071018]">
                <Link href="/request-a-quote">Request a Quote</Link>
              </Button>
              <Button asChild variant="outlineLight" className="rounded-md text-xs font-extrabold uppercase">
                <Link href="/contact">Start Sourcing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ title, centered = false }) {
  return (
    <div className={centered ? "flex flex-col items-center justify-center gap-3 sm:flex-row" : "flex items-center gap-3"}>
      <h2 className="text-xl font-extrabold uppercase text-navy sm:text-2xl">{title}</h2>
    </div>
  );
}

function CheckItem({ children }) {
  return (
    <li className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <span>{children}</span>
    </li>
  );
}

function ChecklistImageCard({ title, subtitle, image, items }) {
  return (
    <article className="overflow-hidden rounded-md border border-border bg-white shadow-card-soft">
      <div className="p-5 sm:p-6">
        <SectionTitle title={title} />
        <h3 className="mt-4 text-base font-extrabold uppercase text-navy">{subtitle}</h3>
      </div>
      <div className="grid gap-0 sm:grid-cols-[1fr_0.9fr] lg:grid-cols-1">
        <ul className="grid gap-3 p-5 pt-0 sm:p-6 sm:pt-0">
          {items.map((item) => (
            <CheckItem key={item}>{item}</CheckItem>
          ))}
        </ul>
        <div className="p-5 pt-0 sm:p-6 sm:pt-0 lg:pt-0">
          <img
            src={image}
            alt={`${title} visual`}
            loading="lazy"
            className="aspect-[16/10] w-full rounded-md object-cover object-center"
          />
        </div>
      </div>
    </article>
  );
}
