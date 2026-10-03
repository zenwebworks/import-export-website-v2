export function AdminCard({ children, className = "" }) {
  return <div className={`rounded-lg border border-border bg-card shadow-card-soft ${className}`}>{children}</div>;
}

export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    gold: "border-gold/30 bg-gold/15 text-gold-foreground",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-destructive/20 bg-destructive/10 text-destructive",
    neutral: "border-border bg-secondary text-muted-foreground",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone] || tones.neutral}`}>{children}</span>;
}

export function LoadingBlock({ label = "Loading" }) {
  return <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">{label}...</div>;
}

export function EmptyBlock({ title, text }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
      <h3 className="text-base font-bold text-navy">{title}</h3>
      {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
