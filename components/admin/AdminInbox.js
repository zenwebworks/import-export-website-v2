"use client";

import { useState } from "react";
import { Eye, Mail, Trash2 } from "lucide-react";
import { AdminShell } from "./AdminShell";
import { AdminDialog } from "./AdminDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import { AdminCard, EmptyBlock, ErrorNotice, LoadingBlock, Pagination, RefreshButton, StatusPill, SuccessNotice, adminStyles as styles } from "./AdminPrimitives";
import { Button } from "@/components/ui/button";
import { useAdminMutation, useAdminQuery } from "@/lib/admin-client";
import { formatDate, refCode } from "@/lib/utils";

export function AdminInbox({ kind }) {
  const quotes = kind === "quotes";
  const endpoint = quotes ? "quotes" : "contact";
  const firstStatus = quotes ? "new" : "unread";
  const lastStatus = quotes ? "processed" : "read";
  const [page, setPage] = useState(1);
  const [status, setFilter] = useState("");
  const [detail, setDetail] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const query = useAdminQuery(kind, `/api/${endpoint}`, { page, limit: 15, status });
  const update = useAdminMutation(kind);
  const remove = useAdminMutation(kind);
  const rows = query.data?.[kind] || [];
  const busy = update.isPending || remove.isPending;
  async function changeStatus(record, nextStatus) {
    setNotice("");
    try {
      const data = await update.mutateAsync({ url: `/api/${endpoint}/${record._id}`, method: "PATCH", body: { status: nextStatus } });
      setDetail(current => current?._id === record._id ? data[quotes ? "quote" : "message"] : current);
      if (rows.length === 1 && page > 1 && status) setPage(page - 1);
      setNotice(`Marked ${nextStatus}.`);
    } catch { /* Mutation error remains visible until retry or dismissal. */ }
  }
  function open(record) {
    update.reset();
    setDetail(record);
    if (!quotes && record.status === "unread") changeStatus(record, "read");
  }
  function confirmDelete(record) { remove.reset(); setDeleteTarget(record); }
  async function deleteRecord() {
    try {
      await remove.mutateAsync({ url: `/api/${endpoint}/${deleteTarget._id}`, method: "DELETE" });
      if (detail?._id === deleteTarget._id) setDetail(null);
      setDeleteTarget(null);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      setNotice(quotes ? "Quote request deleted." : "Message deleted.");
    } catch { /* Keep confirmation open so failure can be retried. */ }
  }
  const fields = !detail ? [] : quotes
    ? [["Reference", refCode(detail._id)], ["Company", detail.companyName], ["Buyer", detail.buyerName], ["Email", detail.email], ["Phone", detail.phone], ["Country", detail.country], ["Product", detail.productNameSnapshot || "General inquiry"], ["Quantity", detail.quantity], ["Delivery port / city", detail.deliveryPort], ["Notes", detail.notes]]
    : [["Name", detail.name], ["Company", detail.company], ["Email", detail.email], ["Phone", detail.phone], ["Message", detail.message], ["Received", formatDate(detail.createdAt)]];
  return <AdminShell title={quotes ? "Quote Requests" : "Contact Messages"} description={quotes ? "Review buyer requirements and manage incoming quote requests." : "Read and respond to enquiries from your website."} action={<RefreshButton query={query} />}>
    <ErrorNotice error={query.error} onRetry={() => query.refetch()} />
    {!detail && <ErrorNotice error={update.error} />}
    <SuccessNotice>{notice}</SuccessNotice>
    <AdminCard>
      <div className={styles.toolbar}><label className="flex items-center gap-3 text-sm font-semibold text-navy">Status<select aria-label="Filter by status" className="rounded-md border border-border bg-white px-3 py-2" value={status} onChange={e => { setFilter(e.target.value); setPage(1); }}><option value="">All statuses</option><option value={firstStatus}>{firstStatus}</option><option value={lastStatus}>{lastStatus}</option></select></label><span className="text-sm text-muted-foreground">{query.data?.total ?? 0} {quotes ? "requests" : "messages"}</span></div>
      {query.isPending ? <LoadingBlock label={quotes ? "Loading quote requests" : "Loading messages"} /> : !query.data ? null : !rows.length ? <EmptyBlock title="Nothing here yet" text={status ? "Try another status to see more records." : "New enquiries will appear here."} /> : <table className={styles.table}><thead><tr><th>{quotes ? "Company / Buyer" : "From"}</th><th>{quotes ? "Product / Reference" : "Message"}</th><th>Received</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map(record => <tr key={record._id} className={record.status === firstStatus ? "bg-gold/5" : ""}>
        <td data-label={quotes ? "Buyer" : "From"}><div><strong className="text-navy">{quotes ? record.companyName : record.name}</strong><p className={styles.secondary}>{quotes ? record.buyerName : record.company || record.email}</p></div></td>
        <td data-label={quotes ? "Product" : "Message"}><div><p className="line-clamp-2 break-words">{quotes ? record.productNameSnapshot || "General inquiry" : record.message}</p>{quotes && <p className={styles.secondary}>{refCode(record._id)}</p>}</div></td>
        <td data-label="Received">{formatDate(record.createdAt)}</td><td data-label="Status"><StatusPill tone={record.status === firstStatus ? "gold" : "green"}>{record.status}</StatusPill></td>
        <td data-label="Actions"><div className={styles.actions}><Button size="sm" variant="outline" disabled={busy || query.isPlaceholderData} onClick={() => open(record)} aria-label={`View ${quotes ? refCode(record._id) : record.name}`}><Eye />View</Button><Button size="sm" variant="outline" disabled={busy || query.isPlaceholderData} onClick={() => confirmDelete(record)} aria-label={`Delete ${quotes ? refCode(record._id) : record.name}`}><Trash2 /></Button></div></td>
      </tr>)}</tbody></table>}
      {query.data && <Pagination page={page} totalPages={query.data.totalPages} total={query.data.total} onChange={setPage} busy={busy || query.isFetching} />}
    </AdminCard>
    {detail && !deleteTarget && <AdminDialog title={quotes ? `Quote ${refCode(detail._id)}` : "Contact message"} busy={busy} onClose={() => setDetail(null)} footer={<><Button asChild variant="outline"><a href={`mailto:${detail.email}`}><Mail />Reply</a></Button><Button variant="navy" disabled={busy} onClick={() => changeStatus(detail, detail.status === firstStatus ? lastStatus : firstStatus)}>{update.isPending ? "Saving…" : `Mark ${detail.status === firstStatus ? lastStatus : firstStatus}`}</Button><Button variant="outline" disabled={busy} onClick={() => confirmDelete(detail)}><Trash2 />Delete</Button></>}><ErrorNotice error={update.error} /><StatusPill tone={detail.status === firstStatus ? "gold" : "green"}>{detail.status}</StatusPill><dl className={styles.detailRows}>{fields.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd className="whitespace-pre-line break-words">{value}</dd></div>)}</dl></AdminDialog>}
    {deleteTarget && <ConfirmDialog title={quotes ? "Delete quote request?" : "Delete message?"} description="This record will be permanently removed from your admin records." loading={remove.isPending} error={remove.error} onCancel={() => setDeleteTarget(null)} onConfirm={deleteRecord} />}
  </AdminShell>;
}
