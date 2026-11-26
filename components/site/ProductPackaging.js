import Image from "next/image";
import Link from "next/link";
import { Boxes, CheckCircle2, Factory, Leaf, Package, PackageOpen, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";

const packagingOptions = [
  { icon: PackageOpen, label: "Pouches" },
  { icon: Boxes, label: "Cartons" },
  { icon: Package, label: "Jars" },
  { icon: Factory, label: "Private Label" },
  { icon: Leaf, label: "Eco Packs" },
  { icon: Warehouse, label: "Bulk Supply" },
];

export function ProductPackaging() {
  return (
      <section id="custom-packaging" aria-labelledby="custom-packaging-heading" className="container-x scroll-mt-24 pb-10 sm:pb-12 lg:pb-14">
        <div className="grid overflow-hidden rounded-lg border border-border bg-white shadow-card-soft lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-5 sm:p-7 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">Packaging Support</p>
            <h2 id="custom-packaging-heading" className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
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
                <Link href="#product-list">Explore Products</Link>
              </Button>
            </div>
          </div>

          <div className="flex min-w-0 items-center border-t border-border bg-[#f7f2ea] p-3 sm:p-4 lg:border-l lg:border-t-0">
            <Image
              src="/assets/ramshel-private-label.webp"
              alt="Ramshel Global Trade green private-label pouch and spice jar with matching kraft cartons and rice sack"
              width={1535}
              height={1024}
              sizes="(max-width: 1023px) 94vw, (max-width: 1279px) 44vw, 520px"
              className="block h-auto w-full rounded-md"
            />
          </div>
        </div>
      </section>
  );
}
