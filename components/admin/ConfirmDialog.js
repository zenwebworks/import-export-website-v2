"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  title = "Confirm action",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-navy/55 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-elevated">
        <div className="p-5">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-navy">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-border bg-surface-muted px-5 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>{loading ? "Deleting..." : confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}