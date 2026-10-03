"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, FolderTree, MessageSquare, Package } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard, LoadingBlock, StatusPill } from "@/components/admin/AdminPrimitives";
import { formatDate, refCode } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [state, setState] = useState({ loading: true, data: null, error: "" });

  useEffect(() => {
    fetch("/api/stats").then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load dashboard");
      setState({ loading: false, data, error: "" });
    }).catch((error) => setState({ loading: false, data: null, error: error.message }));
  }, []);

  const data = state.data;

  return (
    <AdminShell title="Overview" description="Snapshot of catalogue content and buyer activity.">
      {state.loading && <LoadingBlock label="Loading overview" />}
      {state.error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>}
      {data && (
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={FolderTree} label="Categories" value={data.totalCategories} />
            <Metric icon={Package} label="Products" value={data.totalProducts} />
            <Metric icon={FileText} label="Quotes" value={data.totalQuotes} note={`${data.newQuotes} new`} accent={data.newQuotes > 0} />
            <Metric icon={MessageSquare} label="Messages" value={data.totalMessages} note={`${data.unreadMessages} unread`} accent={data.unreadMessages > 0} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Activity title="Recent Quote Requests" href="/admin/quotes" rows={data.recentQuotes} type="quote" />
            <Activity title="Recent Contact Messages" href="/admin/messages" rows={data.recentMessages} type="message" />
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Metric({ icon: Icon, label, value, note, accent }) {
  return (
    <AdminCard className="p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-ocean"><Icon className="h-5 w-5" /></span>
        {note && <StatusPill tone={accent ? "gold" : "neutral"}>{note}</StatusPill>}
      </div>
      <p className="mt-5 text-3xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </AdminCard>
  );
}

function Activity({ title, href, rows, type }) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-bold text-navy">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-ocean hover:text-navy">View all <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="divide-y divide-border">
        {rows.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Nothing yet.</p>}
        {rows.map((row) => (
          <div key={row._id} className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy">{type === "quote" ? row.companyName : row.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{type === "quote" ? `${refCode(row._id)} - ` : ""}{formatDate(row.createdAt)}</p>
            </div>
            <StatusPill tone={(row.status === "new" || row.status === "unread") ? "gold" : "neutral"}>{row.status}</StatusPill>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
