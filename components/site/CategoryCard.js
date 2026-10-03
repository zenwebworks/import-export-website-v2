import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

export function CategoryCard({ category, productCount = 0 }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-navy">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,white,transparent_40%),radial-gradient(circle_at_80%_90%,white,transparent_40%)]" />
            <div className="absolute inset-0 grid place-items-center text-white">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </>
        )}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-navy/60 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/20 backdrop-blur">
            {productCount} products
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-navy">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ocean transition-all group-hover:gap-2">
          View Category <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
