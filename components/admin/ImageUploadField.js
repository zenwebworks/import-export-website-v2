"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGE_UPLOAD_HELP_TEXT, MAX_IMAGE_UPLOAD_BYTES, MAX_IMAGE_UPLOAD_MB, isAcceptedImageType } from "@/lib/upload-config";

export function ImageUploadField({ value, onChange, label = "Image", compact = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file) {
    if (!file) return;

    if (!isAcceptedImageType(file.type)) {
      setError("Please choose a JPG, PNG, WebP or AVIF image.");
      return;
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      setError(`Image must be ${MAX_IMAGE_UPLOAD_MB}MB or smaller.`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const dataUri = await readFileAsDataUri(file);
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: dataUri }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      onChange({ url: data.url, publicId: data.publicId });
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const mediaClassName = compact ? "aspect-square w-full max-w-[220px]" : "aspect-square w-full";

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium text-navy">{label}</span>
      {value?.url ? (
        <div className={`${mediaClassName} relative overflow-hidden rounded-lg border border-border bg-secondary`}>
          <img src={value.url} alt="Uploaded preview" className="h-full w-full object-cover" />
          <Button type="button" variant="navy" size="icon" className="absolute right-3 top-3" onClick={() => onChange({ url: "", publicId: "" })} aria-label="Remove image">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`${mediaClassName} flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface-muted text-muted-foreground transition-colors hover:border-ocean hover:text-ocean disabled:opacity-60`}
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
          <span className="text-sm font-semibold">{uploading ? "Uploading..." : "Click to upload image"}</span>
          <span className="text-xs">{IMAGE_UPLOAD_HELP_TEXT}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function readFileAsDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
