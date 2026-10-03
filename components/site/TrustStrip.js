import { Globe2, Lock, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Globe2, title: "Worldwide Export Support", desc: "Shipping to 40+ countries" },
  { icon: ShieldCheck, title: "Verified Product Quality", desc: "Certified suppliers only" },
  { icon: Lock, title: "Secure Business Process", desc: "Transparent trade terms" },
  { icon: Truck, title: "On-Time Delivery", desc: "Trusted logistics partners" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-x py-8 md:py-10">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-ocean text-white shadow-card-soft">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight text-navy">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
