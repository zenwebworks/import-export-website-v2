"use client";

import { cloneElement, useId, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ImageOff, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./admin.module.css";

export { styles as adminStyles };
export function AdminCard({ children, className = "" }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
export function StatusPill({ children, tone = "neutral" }) {
  const tones = { gold: "border-gold/30 bg-gold/15 text-gold-foreground", green: "border-emerald-200 bg-emerald-50 text-emerald-700", neutral: "border-border bg-secondary text-muted-foreground" };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tones[tone] || tones.neutral}`}>{children}</span>;
}
export function LoadingBlock({ label = "Loading" }) {
  return <div role="status" className="grid gap-4 rounded-xl border border-border bg-white p-8"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />{label}…</div>{[0, 1, 2].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-muted motion-reduce:animate-none" />)}</div>;
}
export function EmptyBlock({ title, text }) {
  return <div className="p-10 text-center"><h3 className="text-base font-bold text-navy">{title}</h3>{text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}</div>;
}
export function ErrorNotice({ error, onRetry }) {
  if (!error) return null;
  return <div role="alert" className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" /><span className="min-w-0 flex-1">{error.message || error}</span>{onRetry && <Button type="button" size="sm" variant="outline" onClick={onRetry}>Try again</Button>}</div>;
}
export function SuccessNotice({ children }) {
  return children ? <p role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" />{children}</p> : null;
}
export function RefreshButton({ query }) {
  return <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? "animate-spin motion-reduce:animate-none" : ""} />{query.isFetching ? "Refreshing…" : "Refresh"}</Button>;
}
export function Thumbnail({ src, name }) {
  const [failedSource, setFailedSource] = useState(null);
  return <div className={styles.thumb}>{src && failedSource !== src ? <img src={src} alt={name} width={56} height={56} loading="lazy" onError={() => setFailedSource(src)} /> : <ImageOff aria-label="No image" className="h-5 w-5" />}</div>;
}
export function Pagination({ page, totalPages = 0, total = 0, onChange, busy = false }) {
  return <div className={styles.pagination}><span>{total} {total === 1 ? "record" : "records"}</span><div><Button size="sm" variant="outline" aria-label="Previous page" disabled={page <= 1 || busy} onClick={() => onChange(page - 1)}><ArrowLeft /></Button><span>Page {page} of {Math.max(1, totalPages)}</span><Button size="sm" variant="outline" aria-label="Next page" disabled={page >= totalPages || busy} onClick={() => onChange(page + 1)}><ArrowRight /></Button></div></div>;
}
export function Field({ label, children }) {
  const id = useId();
  return <div className="grid gap-2"><label htmlFor={id} className="text-xs font-semibold text-navy">{label}</label>{cloneElement(children, { id })}</div>;
}
