const orders = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  az: { name: 1, _id: 1 },
  za: { name: -1, _id: -1 },
};

export function sortCatalogue(query, order, fallback = "az") {
  const fields = orders[Object.hasOwn(orders, order) ? order : fallback];
  if (fields.name) {
    query.collation({ locale: "en", strength: 2, numericOrdering: true });
  }
  return query.sort(fields);
}
