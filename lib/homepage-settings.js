export const HOMEPAGE_LIMIT = 10;

export function homepageFilter(value = "") {
  if (value === "" || value === "all") return {};
  if (value === "yes") return { showOnHomepage: true };
  if (value === "no") return { showOnHomepage: { $ne: true } };
  throw Object.assign(new Error("Invalid homepage filter"), { status: 400 });
}
