import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CataloguePagination({ path, page = 1, totalPages = 1, total = 0, search = "", category = "" }) {
  function href(next) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (next > 1) params.set("page", String(next));
    return `${path}${params.size ? `?${params}` : ""}#product-list`;
  }
  return <nav aria-label="Product pagination" className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground"><span>{total} {total === 1 ? "product" : "products"}</span>{totalPages > 1 && <div className="flex flex-wrap items-center gap-3">{page > 1 && <Button asChild variant="outline" size="sm"><Link href={href(page - 1)} rel="prev">Previous</Link></Button>}<span>Page {page} of {totalPages}</span>{page < totalPages && <Button asChild variant="outline" size="sm"><Link href={href(page + 1)} rel="next">Next</Link></Button>}</div>}</nav>;
}
