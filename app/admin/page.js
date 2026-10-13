"use client";

import Link from "next/link";
import { ArrowRight, FileText, FolderTree, MessageSquare, Package } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard, EmptyBlock, ErrorNotice, LoadingBlock, RefreshButton, StatusPill } from "@/components/admin/AdminPrimitives";
import { useAdminQuery } from "@/lib/admin-client";
import { formatDate, refCode } from "@/lib/utils";

export default function AdminOverviewPage() {
  const query = useAdminQuery("stats", "/api/stats");
  const data = query.data;
  return <AdminShell title="Overview" description="Your catalogue and buyer enquiries, at a glance." action={<RefreshButton query={query} />}>
    <ErrorNotice error={query.error} onRetry={() => query.refetch()} />
    {query.isPending && <LoadingBlock label="Loading overview" />}
    {data && <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={FolderTree} label="Categories" value={data.totalCategories} href="/admin/categories" />
        <Metric icon={Package} label="Products" value={data.totalProducts} href="/admin/products" />
        <Metric icon={FileText} label="Quote requests" value={data.totalQuotes} href="/admin/quotes" note={`${data.newQuotes} new`} accent={data.newQuotes > 0} />
        <Metric icon={MessageSquare} label="Messages" value={data.totalMessages} href="/admin/messages" note={`${data.unreadMessages} unread`} accent={data.unreadMessages > 0} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Activity title="Recent quote requests" href="/admin/quotes" rows={data.recentQuotes} type="quote" />
        <Activity title="Recent messages" href="/admin/messages" rows={data.recentMessages} type="message" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-gradient-navy p-6 text-white"><div><p className="text-xs font-bold uppercase tracking-widest text-gold">Your catalogue</p><h2 className="mt-2 text-lg font-bold">Keep your products ready for the world.</h2><p className="mt-2 text-sm text-white/70">Review images, product details, and homepage selections.</p></div><Link href="/admin/products" className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-4 py-3 text-sm font-bold text-gold">Manage products <ArrowRight className="h-4 w-4" /></Link></div>
    </div>}
  </AdminShell>;
}
function Metric({ icon: Icon, label, value, note, accent, href }) {
  return <Link href={href} className="rounded-xl focus-visible:outline-2 focus-visible:outline-ocean"><AdminCard className="h-full border-t-2 border-t-gold/60 p-5 transition-shadow hover:shadow-elevated"><div className="flex items-center justify-between gap-2"><span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-ocean"><Icon className="h-5 w-5" /></span>{note && <StatusPill tone={accent ? "gold" : "neutral"}>{note}</StatusPill>}</div><p className="mt-5 text-4xl font-bold tracking-tight text-navy">{value}</p><div className="mt-2 flex items-center justify-between text-xs font-medium text-muted-foreground"><span>{label}</span><ArrowRight className="h-4 w-4" /></div></AdminCard></Link>;
}
function Activity({ title, href, rows = [], type }) {
  return <AdminCard><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5"><h2 className="text-sm font-bold text-navy">{title}</h2><Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-ocean">View all <ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="divide-y divide-border">{rows.length === 0 && <EmptyBlock title="You're all caught up" text="New enquiries will appear here." />}{rows.map(row => <Link href={href} key={row._id} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-surface-muted"><div className="min-w-0"><p className="truncate text-sm font-semibold text-navy">{type === "quote" ? row.companyName : row.name}</p><p className="mt-1 text-xs text-muted-foreground">{type === "quote" ? `${refCode(row._id)} · ` : ""}{formatDate(row.createdAt)}</p></div><StatusPill tone={row.status === "new" || row.status === "unread" ? "gold" : "green"}>{row.status}</StatusPill></Link>)}</div></AdminCard>;
}
