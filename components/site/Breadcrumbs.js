import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, tone = "default" }) {
  const light = tone === "light";
  const linkClass = light ? "text-white/75 hover:text-white" : "text-muted-foreground hover:text-navy";
  const currentClass = light ? "text-white" : "text-navy";
  const separatorClass = light ? "text-white/45" : "text-muted-foreground";

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className={cn("inline-flex items-center gap-1 font-medium transition-colors", linkClass)}>
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        {items.map((crumb, index) => (
          <Separated key={`${crumb.label}-${index}`} className={separatorClass}>
            {crumb.href ? (
              <Link href={crumb.href} className={cn("font-medium transition-colors", linkClass)}>
                {crumb.label}
              </Link>
            ) : (
              <span className={cn("font-semibold", currentClass)}>{crumb.label}</span>
            )}
          </Separated>
        ))}
      </ol>
    </nav>
  );
}

function Separated({ children, className }) {
  return (
    <>
      <li aria-hidden="true" className={className}>
        <ChevronRight className="h-3.5 w-3.5" />
      </li>
      <li>{children}</li>
    </>
  );
}
