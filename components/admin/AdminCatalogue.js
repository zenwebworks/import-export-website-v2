"use client";

import { useEffect, useId, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminShell } from "./AdminShell";
import { AdminDialog } from "./AdminDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import { ImageUploadField } from "./ImageUploadField";
import { AdminCard, EmptyBlock, ErrorNotice, Field, LoadingBlock, Pagination, RefreshButton, SuccessNotice, Thumbnail, adminStyles as styles } from "./AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminMutation, useAdminQuery } from "@/lib/admin-client";
import { slugify } from "@/lib/utils";
import { HOMEPAGE_LIMIT } from "@/lib/homepage-settings";

export function AdminCatalogue({ kind }) {
  const isProduct = kind === "products";
  const singular = isProduct ? "Product" : "Category";
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [homepage, setHomepage] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const query = useAdminQuery(kind, `/api/${kind}`, { page, limit: 15, search, homepage, ...(isProduct ? { category } : {}) });
  const categoryQuery = useAdminQuery("categories", "/api/categories");
  const save = useAdminMutation(kind);
  const remove = useAdminMutation(kind);
  const visibility = useAdminMutation(kind);
  const categories = categoryQuery.data?.categories || [];
  const records = query.data?.[kind] || [];
  const filtered = records;
  const busy = save.isPending || remove.isPending || visibility.isPending;
  const homepageCount = query.data?.homepageCount;
  const atLimit = homepageCount >= HOMEPAGE_LIMIT;
  const hasFilters = Boolean(search || category || homepage);

  useEffect(() => {
    if (query.data && !query.isPlaceholderData && page > Math.max(1, query.data.totalPages)) {
      setPage(Math.max(1, query.data.totalPages));
    }
  }, [query.data, query.isPlaceholderData, page]);

  function clearFilters() {
    setSearchInput(""); setSearch(""); setCategory(""); setHomepage(""); setPage(1);
  }
  function toggleHomepage(item) {
    if (busy) return;
    setNotice("");
    visibility.mutate({ url: `/api/${kind}/${item._id}`, method: "PATCH", body: { showOnHomepage: !item.showOnHomepage } }, {
      onSuccess: () => setNotice(`${item.name} ${item.showOnHomepage ? "removed from" : "added to"} the homepage.`),
    });
  }

  function openEditor(item) { visibility.reset(); save.reset(); setNotice(""); setEditing(item); }
  function submit(values) {
    if (save.isPending) return;
    save.mutate({ url: `/api/${kind}${editing._id ? `/${editing._id}` : ""}`, method: editing._id ? "PUT" : "POST", body: values }, {
      onSuccess: () => { setEditing(null); setNotice(`${singular} saved successfully.`); },
    });
  }
  function deleteRecord() {
    if (remove.isPending) return;
    remove.mutate({ url: `/api/${kind}/${deleteTarget._id}`, method: "DELETE" }, {
      onSuccess: () => { setDeleteTarget(null); setNotice(`${singular} deleted.`); if (records.length === 1 && page > 1) setPage(page - 1); },
    });
  }

  return <AdminShell title={isProduct ? "Products" : "Categories"} description={isProduct ? "Keep your export catalogue up to date and ready for buyers." : "Organize your catalogue with clear categories and recognizable images."} action={<><RefreshButton query={query} /><Button variant="gold" disabled={busy || (isProduct && categories.length === 0)} onClick={() => openEditor({ name: "", slug: "", category: categories[0]?._id || "", description: "", image: { url: "", publicId: "" } })}><Plus />New {singular}</Button></>}>
    <ErrorNotice error={query.error} onRetry={() => query.refetch()} />
    {isProduct && <ErrorNotice error={categoryQuery.error} onRetry={() => categoryQuery.refetch()} />}
    <SuccessNotice>{notice}</SuccessNotice>
    <ErrorNotice error={visibility.error} />
    {isProduct && categoryQuery.isSuccess && categories.length === 0 && <p className="mb-4 rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm">Create a category before adding products.</p>}
    <AdminCard>
      <div className={`${styles.toolbar} ${styles.catalogueToolbar}`}>
        <form className={styles.search} onSubmit={event => { event.preventDefault(); setSearch(searchInput.trim()); setPage(1); }}>
          <Input type="search" aria-label={`Search ${kind}`} placeholder={`Search ${kind}…`} value={searchInput} onChange={event => { setSearchInput(event.target.value); if (!event.target.value) { setSearch(""); setPage(1); } }} />
          <Button type="submit" variant="navy" size="icon" aria-label={`Search ${kind}`}><Search /></Button>
        </form>
        <label className={styles.catalogueFilter}><span>Homepage</span><Select aria-label="Filter by homepage visibility" value={homepage} onChange={event => { setHomepage(event.target.value); setPage(1); }}><option value="">All</option><option value="yes">On homepage</option><option value="no">Not on homepage</option></Select></label>
        {isProduct && <label className={styles.catalogueFilter}><span>Category</span><Select aria-label="Filter by category" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}>{[<option key="all" value="">All categories</option>, ...categories.map(item => <option key={item._id} value={item.slug}>{item.name}</option>)]}</Select></label>}
        <div className={styles.catalogueResults}><span aria-live="polite">{query.isFetching ? "Updating…" : `${query.data?.total ?? 0} ${query.data?.total === 1 ? singular.toLowerCase() : kind} found`}</span>{hasFilters && <button type="button" onClick={clearFilters}>Clear filters</button>}</div>
      </div>
      {query.isPending ? <LoadingBlock label={`Loading ${kind}`} /> : query.isError && !query.data ? null : filtered.length === 0 ? <EmptyBlock title={`No ${kind} found`} text={hasFilters ? "Try another search or filter, or clear filters to see all items." : `Add your first ${singular.toLowerCase()} to get started.`} /> : (
        <table className={styles.table} aria-label={isProduct ? "Products" : "Categories"} aria-busy={query.isFetching}>
          <thead><tr><th>{singular}</th><th>{isProduct ? "Category" : "Description"}</th><th>Show on Homepage</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{filtered.map(item => <tr key={item._id}>
            <td><div className={styles.item}><Thumbnail src={item.image_url || item.image?.url} name={item.name} /><div><strong>{item.name}</strong><p className={styles.secondary}>{item.slug}</p></div></div></td>
            <td data-label={isProduct ? "Category" : "Description"}><p className={`${styles.secondary} max-w-md line-clamp-2`}>{isProduct ? item.category?.name || "Unassigned" : item.description || "No description added"}</p></td>
            <td data-label="Homepage">
              <button type="button" role="switch" aria-checked={Boolean(item.showOnHomepage)} aria-label={`Show ${item.name} on homepage`} aria-busy={visibility.isPending && visibility.variables?.url.endsWith(`/${item._id}`)} title={!item.showOnHomepage && atLimit ? "Remove one homepage item before adding another (maximum 10)." : `Show ${item.name} on homepage`} className={styles.homepageSwitch}
                disabled={busy || query.isFetching || (!item.showOnHomepage && atLimit)} onClick={() => toggleHomepage(item)}>
                <span className={styles.switchTrack} aria-hidden="true"><span>{visibility.isPending && visibility.variables?.url.endsWith(`/${item._id}`) && <Loader2 className="h-3 w-3 animate-spin motion-reduce:animate-none" />}</span></span>
              </button>
            </td>
            <td><div className={styles.actions}><Button size="sm" variant="outline" aria-label={`Edit ${item.name}`} disabled={busy || query.isPlaceholderData} onClick={() => openEditor(item)}><Pencil />Edit</Button><Button size="sm" variant="outline" aria-label={`Delete ${item.name}`} disabled={busy || query.isPlaceholderData} onClick={() => { remove.reset(); setNotice(""); setDeleteTarget(item); }}><Trash2 /></Button></div></td>
          </tr>)}</tbody>
        </table>
      )}
      {query.data && <Pagination page={page} totalPages={query.data.totalPages} total={query.data.total} onChange={setPage} busy={query.isFetching} />}
    </AdminCard>
    {editing && <CatalogueEditor item={editing} isProduct={isProduct} categories={categories} homepageCount={homepageCount} saving={save.isPending} error={save.error} onClose={() => setEditing(null)} onSave={submit} />}
    {deleteTarget && <ConfirmDialog title={`Delete ${singular.toLowerCase()}?`} description={isProduct ? `Delete ${deleteTarget.name}? This removes it from the public catalogue.` : `Delete ${deleteTarget.name}? Categories with assigned products cannot be deleted.`} confirmLabel={`Delete ${singular}`} loading={remove.isPending} error={remove.error} onCancel={() => setDeleteTarget(null)} onConfirm={deleteRecord} />}
  </AdminShell>;
}

function CatalogueEditor({ item, isProduct, categories, homepageCount, saving, error, onClose, onSave }) {
  const formId = useId();
  const [uploading, setUploading] = useState(false);
  const [values, setValues] = useState({ ...item, category: item.category?._id || item.category_id || item.category || "", image: item.image || { url: item.image_url || "", publicId: item.image_public_id || "" }, packagingDetails: item.packagingDetails || item.packaging_details || "", showOnHomepage: item.showOnHomepage ?? item.show_on_homepage ?? false });
  const busy = saving || uploading;
  const cannotEnable = !item.showOnHomepage && !values.showOnHomepage && (homepageCount == null || homepageCount >= HOMEPAGE_LIMIT);
  const singular = isProduct ? "Product" : "Category";
  function update(field, value) { setValues(current => ({ ...current, [field]: value })); }
  function submit(event) {
    event.preventDefault();
    if (busy) return;
    const body = { name: values.name, slug: values.slug || slugify(values.name), description: values.description || "", image: { url: values.image?.url || "", publicId: values.image?.publicId || "" }, showOnHomepage: Boolean(values.showOnHomepage) };
    if (isProduct) Object.assign(body, { category: values.category, packagingDetails: values.packagingDetails });
    onSave(body);
  }
  return <AdminDialog title={`${item._id ? "Edit" : "New"} ${singular}`} description="Update your catalogue details and image." onClose={onClose} busy={busy} wide={isProduct} footer={<><Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button><Button form={formId} type="submit" variant="gold" disabled={busy}>{uploading ? "Uploading image…" : saving ? "Saving…" : `Save ${singular}`}</Button></>}>
    <ErrorNotice error={error} />
    <form id={formId} onSubmit={submit}><fieldset disabled={busy} className={`grid min-w-0 gap-6 ${isProduct ? "md:grid-cols-[minmax(0,1fr)_220px]" : ""}`}>
      <div className={styles.fields}>
        <Field label="Name"><Input value={values.name} maxLength={isProduct ? 150 : 100} onChange={event => { update("name", event.target.value); if (!item._id) update("slug", slugify(event.target.value)); }} required /></Field>
        <p className="-mt-3 break-all text-[11px] text-muted-foreground">Page address: /{isProduct ? "products" : "categories"}/{values.slug || "…"}</p>
        {isProduct && <Field label="Category"><Select value={values.category} onChange={event => update("category", event.target.value)} required><option value="" disabled>Select a category</option>{categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}</Select></Field>}
        <Field label="Description"><Textarea value={values.description || ""} maxLength={isProduct ? 5000 : 1000} onChange={event => update("description", event.target.value)} rows={4} /></Field>
        {isProduct && <Field label="Packaging details"><Textarea value={values.packagingDetails} maxLength={3000} onChange={event => update("packagingDetails", event.target.value)} rows={3} /></Field>}
        <div className="grid gap-3 rounded-lg border border-border bg-surface-muted p-4">
          <label className="flex min-h-11 items-center gap-2 text-sm"><Checkbox disabled={cannotEnable} checked={values.showOnHomepage} onChange={event => update("showOnHomepage", event.target.checked)} />Show on Homepage</label>
          <p className="text-xs text-muted-foreground">{homepageCount ?? "…"}/{HOMEPAGE_LIMIT} {isProduct ? "products" : "categories"} selected. {cannotEnable ? "Remove one homepage item before adding another." : "Unchecked items remain available in the full catalogue."}</p>
        </div>
      </div>
      <ImageUploadField value={values.image} onChange={image => update("image", image)} onUploadingChange={setUploading} disabled={saving} label={`${singular} image`} compact />
    </fieldset></form>
  </AdminDialog>;
}
