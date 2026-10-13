"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDialog } from "./AdminDialog";
import { ErrorNotice } from "./AdminPrimitives";

export function ConfirmDialog({ title = "Confirm action", description = "This action cannot be undone.", confirmLabel = "Delete", cancelLabel = "Cancel", loading = false, error, onConfirm, onCancel }) {
  return <AdminDialog title={title} onClose={onCancel} busy={loading} footer={<><Button variant="outline" onClick={onCancel} disabled={loading}>{cancelLabel}</Button><Button variant="destructive" onClick={onConfirm} disabled={loading}>{loading ? "Deleting…" : confirmLabel}</Button></>}><ErrorNotice error={error} /><div className="flex items-start gap-3"><AlertTriangle className="h-6 w-6 shrink-0 text-destructive" /><p className="text-sm leading-relaxed text-muted-foreground">{description}</p></div></AdminDialog>;
}
