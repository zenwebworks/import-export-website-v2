"use client";

import { useEffect, useState } from "react";
import { Eye, Mail, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard, EmptyBlock, LoadingBlock, StatusPill } from "@/components/admin/AdminPrimitives";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatDate, refCode } from "@/lib/utils";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/quotes?limit=50");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load quote requests");
      setQuotes(data.quotes || []);
      setError("");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function setStatus(quote, status) {
    const res = await fetch(`/api/quotes/${quote._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to update status");
    setDetail((current) => current?._id === quote._id ? { ...current, status: data.quote?.status || status } : current);
    await load();
  }
  async function remove(quote) {
    setDeleting(true);
    const res = await fetch(`/api/quotes/${quote._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to delete quote request");
    setDetail(null);
    setDeleteTarget(null);
    setDeleting(false);
    await load();
  }

  return (
    <AdminShell title="Quote Requests" description="RFQs submitted from product and quote forms.">
      {error && <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {loading ? <LoadingBlock label="Loading quote requests" /> : quotes.length === 0 ? <EmptyBlock title="No quote requests yet" text="Incoming buyer enquiries will appear here." /> : (
        <AdminCard className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Company / Buyer</th><th className="px-5 py-3">Product</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{quotes.map((quote) => <tr key={quote._id} className={quote.status === "new" ? "bg-gold/5" : ""}><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{refCode(quote._id)}</td><td className="px-5 py-4"><p className="font-semibold text-navy">{quote.companyName}</p><p className="text-xs text-muted-foreground">{quote.buyerName}</p></td><td className="px-5 py-4 text-muted-foreground">{quote.productNameSnapshot || "General inquiry"}</td><td className="px-5 py-4 text-muted-foreground">{formatDate(quote.createdAt)}</td><td className="px-5 py-4"><button onClick={() => setStatus(quote, quote.status === "new" ? "processed" : "new")}><StatusPill tone={quote.status === "new" ? "gold" : "neutral"}>{quote.status}</StatusPill></button></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => setDetail(quote)}><Eye className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" onClick={() => setDeleteTarget(quote)}><Trash2 className="h-3.5 w-3.5" /></Button></div></td></tr>)}</tbody></table></AdminCard>
      )}
      {detail && <QuoteDetail quote={detail} onClose={() => setDetail(null)} onStatus={(status) => setStatus(detail, status)} onDelete={() => setDeleteTarget(detail)} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete quote request?"
          description={`Delete quote ${refCode(deleteTarget._id)}? This buyer request will be removed from admin records.`}
          confirmLabel="Delete Quote"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget)}
        />
      )}
    </AdminShell>
  );
}

function QuoteDetail({ quote, onClose, onStatus, onDelete }) {
  const rows = [["Reference", refCode(quote._id)], ["Company", quote.companyName], ["Buyer", quote.buyerName], ["Email", quote.email], ["Phone", quote.phone], ["Country", quote.country], ["Product", quote.productNameSnapshot || "General inquiry"], ["Quantity", quote.quantity], ["Delivery Port / City", quote.deliveryPort], ["Notes", quote.notes]];
  return <DetailModal title={`Quote ${refCode(quote._id)}`} rows={rows} onClose={onClose} footer={<><Button asChild variant="outline"><a href={`mailto:${quote.email}`}><Mail className="h-4 w-4" /> Reply</a></Button><Button variant="navy" onClick={() => onStatus(quote.status === "new" ? "processed" : "new")}>Mark {quote.status === "new" ? "processed" : "new"}</Button><Button variant="outline" onClick={onDelete}><Trash2 className="h-4 w-4" /> Delete</Button></>} />;
}

function DetailModal({ title, rows, footer, onClose }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 p-4"><div className="w-full max-w-xl rounded-lg bg-background p-6 shadow-elevated"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-navy">{title}</h2><Button variant="ghost" onClick={onClose}>Close</Button></div><div className="mt-5 divide-y divide-border">{rows.filter(([, value]) => value).map(([label, value]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr]"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="whitespace-pre-line text-sm text-navy">{value}</p></div>)}</div><div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div></div></div>;
}
