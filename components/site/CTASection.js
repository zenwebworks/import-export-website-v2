import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection({
  title = "Looking for a Reliable Import and Export Partner?",
  text = "Share your product requirements with us and receive a customised quotation from our trade team.",
  cta = "Request a Quote",
} = {}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/assets/cta-global.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
      </div>
      <div className="container-x relative py-20 md:py-28">
        <div className="max-w-2xl text-white">
          <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
            Global Trade Solutions
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="xl">
              <Link href="/request-a-quote">
                {cta} <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
