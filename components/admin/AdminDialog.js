"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./admin.module.css";

export function AdminDialog({ title, description, children, footer, onClose, busy = false, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return (
    <dialog ref={ref} aria-labelledby={titleId} className={styles.dialog} style={wide ? { maxWidth: 840 } : undefined}
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
      <div className={styles.dialogInner}>
        <div className={styles.dialogHead}>
          <div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div>
          <Button type="button" variant="ghost" size="icon" aria-label="Close dialog" disabled={busy} onClick={onClose}><X /></Button>
        </div>
        <div className={styles.dialogBody}>{children}</div>
        {footer && <div className={styles.dialogFooter}>{footer}</div>}
      </div>
    </dialog>
  );
}
