"use client";

import { useEffect, useState } from "react";
import { Eye, Mail, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard, EmptyBlock, LoadingBlock, StatusPill } from "@/components/admin/AdminPrimitives";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact?limit=50");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load messages");
      setMessages(data.messages || []);
      setError("");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function setStatus(message, status) {
    const res = await fetch(`/api/contact/${message._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to update status");
    setDetail((current) => current?._id === message._id ? { ...current, status: data.message?.status || status } : current);
    await load();
  }
  async function remove(message) {
    setDeleting(true);
    const res = await fetch(`/api/contact/${message._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to delete message");
    setDetail(null);
    setDeleteTarget(null);
    setDeleting(false);
    await load();
  }
  function open(message) {
    setDetail(message);
    if (message.status === "unread") setStatus(message, "read");
  }

  return (
    <AdminShell title="Contact Messages" description="General enquiries submitted from the contact page.">
      {error && <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {loading ? <LoadingBlock label="Loading messages" /> : messages.length === 0 ? <EmptyBlock title="No messages yet" text="Contact form submissions will appear here." /> : (
        <AdminCard className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">From</th><th className="px-5 py-3">Message</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{messages.map((message) => <tr key={message._id} className={message.status === "unread" ? "bg-gold/5" : ""}><td className="px-5 py-4"><p className="font-semibold text-navy">{message.name}</p><p className="text-xs text-muted-foreground">{message.company || message.email}</p></td><td className="max-w-md px-5 py-4 text-muted-foreground"><p className="truncate">{message.message}</p></td><td className="px-5 py-4 text-muted-foreground">{formatDate(message.createdAt)}</td><td className="px-5 py-4"><button onClick={() => setStatus(message, message.status === "unread" ? "read" : "unread")}><StatusPill tone={message.status === "unread" ? "gold" : "neutral"}>{message.status}</StatusPill></button></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => open(message)}><Eye className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" onClick={() => setDeleteTarget(message)}><Trash2 className="h-3.5 w-3.5" /></Button></div></td></tr>)}</tbody></table></AdminCard>
      )}
      {detail && <MessageDetail message={detail} onClose={() => setDetail(null)} onDelete={() => setDeleteTarget(detail)} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete message?"
          description={`Delete message from ${deleteTarget.name}? This contact submission will be removed from admin records.`}
          confirmLabel="Delete Message"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget)}
        />
      )}
    </AdminShell>
  );
}

function MessageDetail({ message, onClose, onDelete }) {
  const rows = [["Name", message.name], ["Company", message.company], ["Email", message.email], ["Phone", message.phone], ["Message", message.message], ["Received", formatDate(message.createdAt)]];
  return <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 p-4"><div className="w-full max-w-xl rounded-lg bg-background p-6 shadow-elevated"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-navy">Contact Message</h2><Button variant="ghost" onClick={onClose}>Close</Button></div><div className="mt-5 divide-y divide-border">{rows.filter(([, value]) => value).map(([label, value]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="whitespace-pre-line text-sm text-navy">{value}</p></div>)}</div><div className="mt-6 flex flex-wrap justify-end gap-2"><Button asChild variant="navy"><a href={`mailto:${message.email}`}><Mail className="h-4 w-4" /> Reply</a></Button><Button variant="outline" onClick={onDelete}><Trash2 className="h-4 w-4" /> Delete</Button></div></div></div>;
}
