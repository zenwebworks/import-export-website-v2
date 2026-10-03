"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BarChart3, FileText, FolderTree, LogOut, Menu, MessageSquare, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export function AdminShell({ title, description, action, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href) {
    return href === "/admin" ? pathname === href : pathname.startsWith(href);
  }

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-4 py-4">
            <p className="text-sm font-semibold text-navy">Admin Panel</p>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-5">
            {nav.map(({ href, label, icon: Icon }) => (
              <AdminNavLink key={href} href={href} label={label} icon={Icon} active={isActive(href)} />
            ))}
          </nav>
          <AdminFooter />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur lg:hidden">
          <div className="container-x flex min-h-16 items-center justify-between gap-3 py-3">
            <Button variant="outline" size="icon" className="shrink-0" aria-label="Open admin menu" onClick={() => setMobileNavOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="h-10 w-10" aria-hidden="true" />
          </div>
        </header>
        <main className="container-x py-6 md:py-8">
          <section className="mb-6 flex flex-col gap-4 rounded-lg border border-border bg-background p-5 shadow-card-soft sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-navy md:text-3xl">{title}</h1>
              {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>}
            </div>
            {action && <div className="flex shrink-0 [&>*]:w-full sm:justify-end sm:[&>*]:w-auto">{action}</div>}
          </section>
          {children}
        </main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-navy/45" aria-label="Close admin menu" onClick={closeMobileNav} />
          <div className="absolute left-0 top-0 flex h-dvh w-full max-w-xs flex-col bg-background shadow-elevated">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <p className="text-sm font-semibold text-navy">Admin Panel</p>
              <Button variant="ghost" size="icon" aria-label="Close admin menu" onClick={closeMobileNav}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-5">
              {nav.map(({ href, label, icon: Icon }) => (
                <AdminNavLink key={href} href={href} label={label} icon={Icon} active={isActive(href)} onClick={closeMobileNav} />
              ))}
            </nav>
            <AdminFooter onBrandClick={closeMobileNav} />
          </div>
        </div>
      )}
    </div>
  );
}

function AdminFooter({ onBrandClick }) {
  return (
    <div className="space-y-4 border-t border-border p-4">
      <AdminBrand onClick={onBrandClick} />
      <Button variant="outline" className="w-full justify-start" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}

function AdminBrand({ className = "", onClick }) {
  return (
    <Link href="/admin" className={cn("flex min-w-0 rounded-lg border border-border bg-surface-muted p-3", className)} onClick={onClick}>
      <span className="flex w-full items-center rounded-lg bg-navy px-2.5 py-1.5 shadow-card-soft ring-1 ring-white/10">
        <img src="/assets/logo.webp" alt={SITE.name} className="h-8 w-auto max-w-[170px] object-contain" />
      </span>
    </Link>
  );
}

function AdminNavLink({ href, label, icon: Icon, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-navy text-white" : "text-muted-foreground hover:bg-secondary hover:text-navy",
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}