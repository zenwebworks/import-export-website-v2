export function parsePagination(params, defaultLimit = 15, maxLimit = 100) {
  const read = (key, fallback) => {
    const value = params.get(key);
    if (value === null || value === "") return fallback;
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) {
      throw Object.assign(new Error(`Invalid ${key}: use a positive whole number.`), { status: 400 });
    }
    return Number(value);
  };
  const page = read("page", 1);
  const limit = Math.min(read("limit", defaultLimit), maxLimit);
  if (!Number.isSafeInteger((page - 1) * limit)) throw Object.assign(new Error("Page is too large."), { status: 400 });
  return { page, limit };
}

export function validObjectId(value) { return typeof value === "string" && /^[a-f\d]{24}$/i.test(value); }
export function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function catalogueParams(params = {}) {
  const first = value => String(Array.isArray(value) ? value[0] || "" : value || "");
  const rawPage = first(params.page);
  const page = /^\d+$/.test(rawPage) && Number.isSafeInteger(Number(rawPage)) && Number(rawPage) > 0 && Number(rawPage) <= 1000000 ? Number(rawPage) : 1;
  return { page, search: first(params.search || params.q).trim().slice(0, 200), category: first(params.category).slice(0, 150) };
}
