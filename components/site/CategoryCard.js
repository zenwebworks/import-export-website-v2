import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

export function CategoryCard({ category, productCount = 0 }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card-soft transition-[border-color,box-shadow] duration-200 hover:border-ocean/40 hover:shadow-elevated focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ocean motion-reduce:transition-none"
    >
      <div className={`relative aspect-square shrink-0 overflow-hidden ${category.image_url ? "bg-white" : "bg-gradient-navy"}`}>
        {category.image_url ? (
          <img
            src={category.image_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,white,transparent_40%),radial-gradient(circle_at_80%_90%,white,transparent_40%)]" />
            <div className="absolute inset-0 grid place-items-center text-white">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/12 ring-1 ring-white/20 backdrop-blur-sm sm:h-12 sm:w-12">
                <Package aria-hidden="true" className="h-5 w-5" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
        <h2 className="text-sm font-bold leading-snug text-navy [overflow-wrap:anywhere] sm:text-base">{category.name}</h2>
        {category.description && (
          <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">{category.description}</p>
        )}
        <div className="mt-auto pt-3">
          <span className="flex items-center justify-between gap-2 border-t border-border pt-2.5 text-xs font-semibold text-ocean sm:text-sm">
            View Category <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </span>
        </div>
      </div>
    </Link>
  );
}
