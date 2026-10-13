"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, BarChart3, FileText, FolderTree, Globe2, LogOut, Menu, MessageSquare, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDialog } from "./AdminDialog";
import { SITE } from "@/lib/site";
import styles from "./admin.module.css";

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
  function navigation(onClick) {
    return nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={onClick} className={styles.navLink} aria-current={(href === "/admin" ? pathname === href : pathname.startsWith(href)) ? "page" : undefined}><Icon aria-hidden="true" />{label}</Link>);
  }
  return <div className={styles.shell}>
    <aside className={styles.sidebar} aria-label="Admin sidebar">
      <Link href="/admin" className={styles.brand}><img src="/assets/logo-last.webp" alt={SITE.name} /><span>Administration</span></Link>
      <nav className={styles.nav} aria-label="Admin navigation"><p className={styles.navLabel}>Workspace</p>{navigation()}</nav>
      <div className={styles.sidebarFooter}><Link href="/" target="_blank" rel="noreferrer">View website <ArrowUpRight className="h-4 w-4" /></Link><SignOutButton /></div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <div className={styles.topbarLabel}><Globe2 className="h-4 w-4 text-ocean" />Ramshel Global Trade <span className="text-border">/</span> Administration</div>
        <Link href="/admin" className={styles.mobileBrand}><img src="/assets/logo-last.webp" alt={SITE.name} /></Link>
        <span className="hidden items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-muted-foreground lg:flex"><ShieldCheck className="h-3.5 w-3.5 text-ocean" />Admin workspace</span>
        <Button variant="outline" size="icon" className={styles.menuButton} aria-label="Open admin menu" onClick={() => setMobileNavOpen(true)}><Menu /></Button>
      </header>
      <main className={styles.main}>
        <div className={styles.pageHead}><div><p className={styles.eyebrow}>Ramshel / Administration</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className={styles.headAction}>{action}</div>}</div>
        {children}
      </main>
    </div>
    {mobileNavOpen && <AdminDialog title="Your workspace" onClose={() => setMobileNavOpen(false)} footer={<SignOutButton />}><nav aria-label="Mobile admin navigation" className="rounded-xl bg-navy p-3">{navigation(() => setMobileNavOpen(false))}</nav><Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ocean">View website <ArrowUpRight className="h-4 w-4" /></Link></AdminDialog>}
  </div>;
}

function SignOutButton() {
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setBusy(true); setError("");
    await client.cancelQueries(); client.clear();
    try { await signOut({ callbackUrl: "/admin/login" }); }
    catch { setError("Unable to sign out. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="w-full"><Button variant="gold" className="w-full" onClick={logout} disabled={busy}><LogOut />{busy ? "Signing out…" : "Sign out"}</Button>{error && <p role="alert" className="mt-2 text-xs">{error}</p>}</div>;
}
