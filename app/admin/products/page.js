"use client";

import { useEffect, useState } from "react";
import { Home, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard, EmptyBlock, LoadingBlock, StatusPill } from "@/components/admin/AdminPrimitives";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

const emptyProduct = { name: "", slug: "", category: "", description: "", packagingDetails: "", featured: false, showOnHomepage: false, image: { url: "", publicId: "" } };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
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
      const [productRes, categoryRes] = await Promise.all([fetch("/api/products?limit=100"), fetch("/api/categories")]);
      const productData = await productRes.json();
      const categoryData = await categoryRes.json();
      if (!productRes.ok) throw new Error(productData.error || "Failed to load products");
      if (!categoryRes.ok) throw new Error(categoryData.error || "Failed to load categories");
      setProducts(productData.products || []);
      setCategories(categoryData.categories || []);
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
      const res = await fetch(isEdit ? `/api/products/${editing._id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(product) {
    setDeleting(true);
    const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to delete product");
    setDeleteTarget(null);
    setDeleting(false);
    await load();
  }

  const action = <Button variant="gold" disabled={categories.length === 0} onClick={() => setEditing({ ...emptyProduct, category: categories[0]?._id || "" })}><Plus className="h-4 w-4" /> New Product</Button>;

  return (
    <AdminShell title="Products" description="Manage export-ready catalogue items." action={action}>
      {error && <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {categories.length === 0 && !loading && <p className="mb-4 rounded-md bg-gold/15 px-3 py-2 text-sm text-gold-foreground">Create a category before adding products.</p>}
      {loading ? <LoadingBlock label="Loading products" /> : products.length === 0 ? <EmptyBlock title="No products yet" text="Add products to power the public catalogue." /> : (
        <AdminCard className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Flags</th><th className="px-5 py-3">Slug</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => <tr key={product._id}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-secondary">{product.image_url && <img src={product.image_url} alt="" className="h-full w-full object-cover" />}</div><span className="font-semibold text-navy">{product.name}</span></div></td><td className="px-5 py-4 text-muted-foreground">{product.category?.name || "-"}</td><td className="px-5 py-4"><div className="flex gap-2">{product.featured && <StatusPill tone="gold"><Star className="mr-1 h-3 w-3" /> Featured</StatusPill>}{product.show_on_homepage && <StatusPill><Home className="mr-1 h-3 w-3" /> Homepage</StatusPill>}</div></td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{product.slug}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => setEditing({ ...product, category: product.category?._id || product.category_id })}><Pencil className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" onClick={() => setDeleteTarget(product)}><Trash2 className="h-3.5 w-3.5" /></Button></div></td></tr>)}
            </tbody>
          </table>
        </AdminCard>
      )}
      {editing && <ProductModal product={editing} categories={categories} saving={saving} onClose={() => setEditing(null)} onSave={save} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete product?"
          description={`Delete ${deleteTarget.name}? This removes it from the public catalogue.`}
          confirmLabel="Delete Product"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget)}
        />
      )}
    </AdminShell>
  );
}

function ProductModal({ product, categories, saving, onClose, onSave }) {
  const [values, setValues] = useState({ ...emptyProduct, ...product, image: product.image || { url: product.image_url || "", publicId: product.image_public_id || "" }, packagingDetails: product.packagingDetails || product.packaging_details || "", showOnHomepage: product.showOnHomepage ?? product.show_on_homepage ?? false });

  function update(field, value) { setValues((current) => ({ ...current, [field]: value })); }
  function submit(event) {
    event.preventDefault();
    onSave({ name: values.name, slug: values.slug || slugify(values.name), category: values.category, description: values.description || "", packagingDetails: values.packagingDetails || "", featured: Boolean(values.featured), showOnHomepage: Boolean(values.showOnHomepage), image: { url: values.image?.url || "", publicId: values.image?.publicId || "" } });
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/50 px-4 py-6">
      <div className="flex min-h-full items-center justify-center">
        <form onSubmit={submit} className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-background shadow-elevated">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-bold text-navy">{product._id ? "Edit Product" : "New Product"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage catalogue details, category assignment and display options.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="grid gap-4">
                <Field label="Name"><Input value={values.name} onChange={(e) => { update("name", e.target.value); if (!product._id) update("slug", slugify(e.target.value)); }} required /></Field>
                <Field label="Category"><Select value={values.category} onChange={(e) => update("category", e.target.value)} required>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</Select></Field>
                <Field label="Description"><Textarea value={values.description || ""} onChange={(e) => update("description", e.target.value)} rows={4} /></Field>
                <Field label="Packaging Details"><Textarea value={values.packagingDetails || ""} onChange={(e) => update("packagingDetails", e.target.value)} rows={3} /></Field>
                <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-navy"><Checkbox checked={values.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured</label>
                  <label className="flex items-center gap-2 text-sm font-medium text-navy"><Checkbox checked={values.showOnHomepage} onChange={(e) => update("showOnHomepage", e.target.checked)} /> Show on homepage</label>
                </div>
              </div>
              <div className="lg:pt-0">
                <ImageUploadField value={values.image} onChange={(image) => setValues((current) => ({ ...current, image }))} label="Product image" compact />
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={saving}>{saving ? "Saving..." : "Save Product"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) { return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>; }
