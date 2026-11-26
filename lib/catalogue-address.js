export function slugify(name) {
  return name.normalize("NFKD")
    .toLowerCase()
    .replace(/\p{M}+/gu, "")
    .replace(/['\u2018\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function catalogueAddress(name, kind, existing) {
  const normalized = slugify(name);
  const titleKey = value => slugify(value) || value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").trim();
  if (existing?.slug && titleKey(name) === titleKey(existing.name)) return existing.slug;
  // Public links use ASCII. Give names written entirely in another script a usable link.
  const base = normalized || (/\p{L}|\p{N}/u.test(name) ? kind : "");
  return base.slice(0, kind === "product" ? 150 : 100).replace(/-$/, "");
}
