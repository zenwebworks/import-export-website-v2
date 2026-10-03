import Link from "next/link";
import { ArrowUpRight, MessageSquare, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft transition-all duration-300 hover:shadow-elevated">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-ocean text-white">
            <Package2 className="h-10 w-10" />
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow">
            Featured
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {product.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ocean">
            {product.category.name}
          </span>
        )}
        <h3 className="mt-1.5 text-base font-bold leading-snug text-navy">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 transition-colors hover:text-ocean">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{product.description}</p>

        {product.packaging_details && (
          <p className="mt-4 flex items-start gap-1.5 text-[12px] text-muted-foreground">
            <Package2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ocean" />
            <span className="line-clamp-1">{product.packaging_details}</span>
          </p>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-4">
          <Button asChild size="sm" variant="navy" className="h-9 min-w-0 px-2 text-xs sm:h-10 sm:text-sm">
            <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
              <span>Details</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="h-9 min-w-0 px-2 text-xs sm:h-10 sm:text-sm">
            <Link href={`/request-a-quote?product=${encodeURIComponent(product.slug)}`} aria-label={`Request quote for ${product.name}`}>
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Quote</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
