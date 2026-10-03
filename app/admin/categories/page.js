"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard, EmptyBlock, LoadingBlock } from "@/components/admin/AdminPrimitives";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

const emptyCategory = { name: "", slug: "", description: "", image: { url: "", publicId: "" } };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load categories");
      setCategories(data.categories || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save(values) {
    setSaving(true);
    try {
      const isEdit = Boolean(editing?._id);
      const res = await fetch(isEdit ? `/api/categories/${editing._id}` : "/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(category) {
    setDeleting(true);
    const res = await fetch(`/api/categories/${category._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to delete category");
    setDeleteTarget(null);
    setDeleting(false);
    await load();
  }

  return (
    <AdminShell title="Categories" description="Organize product catalogue sections." action={<Button variant="gold" onClick={() => setEditing(emptyCategory)}><Plus className="h-4 w-4" /> New Category</Button>}>
      {error && <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {loading ? <LoadingBlock label="Loading categories" /> : categories.length === 0 ? <EmptyBlock title="No categories yet" text="Create your first category to begin building the catalogue." /> : (
        <AdminCard className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Category</th><th className="px-5 py-3">Slug</th><th className="px-5 py-3">Description</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => <tr key={category._id}><td className="px-5 py-4 font-semibold text-navy">{category.name}</td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{category.slug}</td><td className="max-w-sm px-5 py-4 text-muted-foreground"><p className="line-clamp-2">{category.description}</p></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => setEditing(category)}><Pencil className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" onClick={() => setDeleteTarget(category)}><Trash2 className="h-3.5 w-3.5" /></Button></div></td></tr>)}
            </tbody>
          </table>
        </AdminCard>
      )}
      {editing && <CategoryModal category={editing} saving={saving} onClose={() => setEditing(null)} onSave={save} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete category?"
          description={`Delete ${deleteTarget.name}? Products assigned to this category may need to be reviewed.`}
          confirmLabel="Delete Category"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget)}
        />
      )}
    </AdminShell>
  );
}

function CategoryModal({ category, saving, onClose, onSave }) {
  const [values, setValues] = useState(category);
  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  function submit(event) {
    event.preventDefault();
    onSave({ ...values, slug: values.slug || slugify(values.name), image: { url: values.image?.url || "", publicId: values.image?.publicId || "" } });
  }
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/50 px-4 py-6">
      <div className="flex min-h-full items-center justify-center">
        <form onSubmit={submit} className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-background shadow-elevated">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-bold text-navy">{category._id ? "Edit Category" : "New Category"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add the basic category details and a square catalogue image.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid gap-4">
              <Field label="Name"><Input value={values.name} onChange={(e) => { update("name", e.target.value); if (!category._id) update("slug", slugify(e.target.value)); }} required /></Field>
              <ImageUploadField value={values.image} onChange={(image) => setValues((current) => ({ ...current, image }))} label="Category image" compact />
              <Field label="Description"><Textarea value={values.description || ""} onChange={(e) => update("description", e.target.value)} rows={3} /></Field>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={saving}>{saving ? "Saving..." : "Save Category"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>;
}
