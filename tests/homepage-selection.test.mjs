import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import * as validations from "../lib/validations.js";
import * as params from "../lib/request-params.js";
import * as settings from "../lib/homepage-settings.js";
import * as sorting from "../lib/catalogue-sort.js";

async function loadModule(path, dependencies) {
  const module = new vm.SourceTextModule(await readFile(new URL(path, import.meta.url), "utf8"));
  await module.link(specifier => {
    const values = dependencies[specifier];
    assert.ok(values, `Missing dependency: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value);
    });
  });
  await module.evaluate();
  return module.namespace;
}

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
function matches(row, filter) {
  return Object.entries(filter).every(([key, value]) => {
    if (key === "$or") return value.some(part => matches(row, part));
    if (value && typeof value === "object" && "$ne" in value) return String(row[key]) !== String(value.$ne);
    if (value?.$regex !== undefined) return new RegExp(value.$regex, value.$options).test(row[key] || "");
    return String(row[key]) === String(value);
  });
}

async function fixture() {
  const stores = { categories: [], products: [] };
  let authorized = true, invalidations = 0, writeFailure = false, tail = Promise.resolve();
  const query = work => {
    const state = { skip: 0, limit: Infinity };
    const execute = async () => {
      let result = await work(state);
      if (Array.isArray(result)) {
        if (state.sort) result = [...result].sort((a, b) => {
          for (const [key, direction] of Object.entries(state.sort)) {
            const left = String(a[key] ?? "");
            const right = String(b[key] ?? "");
            const comparison = key === "name" && state.collator
              ? state.collator.compare(left, right)
              : left.localeCompare(right);
            const order = comparison * direction;
            if (order) return order;
          }
          return 0;
        });
        result = result.slice(state.skip, state.skip + state.limit);
      }
      return clone(result);
    };
    const chain = {
      session: session => { assert.ok(session.locked, "Selection reads must follow the transaction lock"); state.session = session; return chain; },
      sort: value => { state.sort = value; return chain; },
      collation: options => {
        state.collator = new Intl.Collator(options.locale, {
          sensitivity: options.strength === 2 ? "accent" : "variant",
          numeric: options.numericOrdering,
        });
        return chain;
      },
      select: () => chain,
      skip: value => { state.skip = value; return chain; },
      limit: value => { state.limit = value; return chain; },
      populate: () => chain,
      lean: execute,
      then: (resolve, reject) => execute().then(resolve, reject),
    };
    return chain;
  };
  const models = {};
  for (const [kind, RealModel] of [["categories", Category], ["products", Product]]) {
    models[kind] = {
      modelName: RealModel.modelName,
      find: filter => query(() => stores[kind].filter(row => matches(row, filter))),
      findOne: filter => query(() => stores[kind].find(row => matches(row, filter)) || null),
      countDocuments: filter => query(() => stores[kind].filter(row => matches(row, filter)).length),
      findById: id => query(() => stores[kind].find(row => row._id === String(id)) || null),
      exists: async filter => stores[kind].some(row => matches(row, filter)),
      populate: async record => record,
      create: async (values, { session }) => {
        assert.ok(session.locked);
        if (writeFailure) throw new Error("Database unavailable");
        const records = values.map(value => new RealModel(value));
        await Promise.all(records.map(record => record.validate()));
        stores[kind].push(...records.map(record => clone(record.toObject())));
        return records;
      },
      findByIdAndUpdate: (id, update, { session }) => query(() => {
        assert.ok(session.locked);
        if (writeFailure) throw new Error("Database unavailable");
        const row = stores[kind].find(row => row._id === String(id));
        Object.assign(row, update.$set);
        return row;
      }),
    };
  }
  const dependencies = {
    mongoose: { default: { connection: { transaction: async work => {
      // Simulate transaction serialization and rollback; the real implementation
      // must acquire the database lock before any selection reads or writes.
      const previous = tail;
      let release;
      tail = new Promise(resolve => { release = resolve; });
      await previous;
      const snapshot = clone(stores);
      try { return await work({ locked: false }); }
      catch (error) { Object.assign(stores, snapshot); throw error; }
      finally { release(); }
    } } } },
    "@/models/HomepageSelectionLock": { default: { updateOne: async (filter, update, options) => {
      assert.ok(["Category", "Product"].includes(filter._id));
      if (options.session) { assert.equal(update.$inc.revision, 1); options.session.locked = true; }
    } } },
    react: { cache: fn => fn },
    "next/cache": { unstable_cache: (fn, keys, options) => {
      if (keys[0].startsWith("getHomepage")) assert.ok(options.tags.includes("public-catalogue"));
      return fn;
    } },
    "@/lib/homepage-settings": settings,
    "@/lib/catalogue-sort": sorting,
    "@/lib/catalogue-cache": { CATALOGUE_TAG: "public-catalogue", invalidateCatalogue: () => { invalidations++; } },
    "@/lib/request-params": params,
    "@/lib/db": { connectDB: async () => {} },
    "@/models/Category": { default: models.categories },
    "@/models/Product": { default: models.products },
    "@/lib/validations": validations,
    "@/lib/api-auth": { requireAdmin: async () => authorized ? null : Response.json({ error: "Unauthorized" }, { status: 401 }) },
    "@/lib/cloudinary": { deleteImage: async () => {} },
    "next/server": { NextResponse: { json: Response.json } },
  };
  dependencies["@/lib/homepage-selection"] = await loadModule("../lib/homepage-selection.js", dependencies);
  dependencies["@/lib/homepage-route"] = await loadModule("../lib/homepage-route.js", dependencies);
  const data = await loadModule("../lib/data.js", dependencies);
  dependencies["@/lib/data"] = data;
  const routes = {};
  for (const kind of ["categories", "products"]) {
    routes[kind] = {
      ...await loadModule(`../app/api/${kind}/route.js`, dependencies),
      ...await loadModule(`../app/api/${kind}/[id]/route.js`, dependencies),
    };
  }
  const baseCategory = new Category({ name: "Base category", slug: "base" });
  stores.categories.push(clone(baseCategory.toObject()));
  return {
    stores, data,
    input: (name, enabled = false) => ({ name, slug: name.toLowerCase().replaceAll(" ", "-"), category: String(baseCategory._id), showOnHomepage: enabled, description: "Original details" }),
    call: (kind, method, body, id = "", search = "") => routes[kind][method](new Request(`https://site.test/api/${kind}?${search}`, {
      method, ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    }), { params: Promise.resolve({ id }) }),
    invalidations: () => invalidations,
    deny: () => { authorized = false; },
    fail: () => { writeFailure = true; },
  };
}

test("catalogue sorts filtered records before pagination and breaks name and date ties consistently", async () => {
  const f = await fixture();
  const category = f.stores.categories[0]._id;
  const rows = [
    ["spice 10", "2026-01-02"],
    ["Spice 2", "2026-01-01"],
    ["SPICE 2", "2026-01-02"],
    ["Spice 1", "2026-01-04"],
    ["Other item", "2026-01-05"],
  ].map(([name, createdAt], i) => ({
    _id: String(i + 1).padStart(24, "0"), name, category, createdAt, showOnHomepage: true,
  }));
  const expected = { newest: [4, 3, 1, 2], oldest: [2, 1, 3, 4], az: [4, 2, 3, 1], za: [1, 3, 2, 4] };
  for (const kind of ["categories", "products"]) {
    f.stores[kind].push(...rows);
    for (const [sort, ids] of Object.entries(expected)) {
      const actual = [];
      for (const page of [1, 2]) {
        const response = await f.call(kind, "GET", null, "", `search=spice&homepage=yes&sort=${sort}&page=${page}&limit=2`);
        assert.equal(response.status, 200);
        const data = await response.json();
        assert.equal(data.total, 4);
        actual.push(...data[kind].map(row => Number(row._id)));
      }
      assert.deepEqual(actual, ids, `${kind} ${sort}`);
    }
    const defaultList = await (await f.call(kind, "GET", null, "", "search=spice")).json();
    assert.deepEqual(defaultList[kind].map(row => Number(row._id)), kind === "products" ? expected.newest : expected.az);
  }
  const publicIds = [];
  for (const page of [1, 2]) {
    const result = await f.data.getProductsPage("base", "spice", page, 2);
    publicIds.push(...result.products.map(row => Number(row._id)));
  }
  assert.deepEqual(publicIds, expected.az);
});

test("product HS codes survive creation, reading, editing and clearing without losing leading zeros", async () => {
  const f = await fixture();
  const input = { ...f.input("Coded product"), hsCode: "  01012100  " };
  const created = await f.call("products", "POST", input);
  assert.equal(created.status, 201);
  const { product } = await created.json();
  assert.equal(product.hsCode, "01012100");
  assert.equal(product.hs_code, "01012100");
  assert.equal(f.stores.products[0].hsCode, "01012100");
  const listed = await (await f.call("products", "GET")).json();
  assert.equal(listed.products[0].hsCode, "01012100");
  assert.equal((await f.data.getProductBySlug(product.slug)).hsCode, "01012100");

  const edited = await f.call("products", "PUT", { ...input, hsCode: "0101.29" }, product._id);
  assert.equal(edited.status, 200);
  assert.equal((await edited.json()).product.hsCode, "0101.29");
  const omitted = await f.call("products", "PUT", f.input("Coded product"), product._id);
  assert.equal(omitted.status, 200);
  assert.equal((await omitted.json()).product.hsCode, "0101.29");
  const cleared = await f.call("products", "PUT", { ...input, hsCode: "  " }, product._id);
  assert.equal(cleared.status, 200);
  assert.equal((await cleared.json()).product.hsCode, "");
  assert.equal(f.stores.products[0].hsCode, "");
});

test("HS codes remain optional for existing products and invalid input cannot overwrite a saved code", async () => {
  const f = await fixture();
  const created = await f.call("products", "POST", f.input("Legacy product"));
  assert.equal(created.status, 201);
  const { product } = await created.json();
  delete f.stores.products[0].hsCode;
  assert.equal((await f.data.getProductBySlug(product.slug)).hsCode, "");
  assert.equal((await f.call("products", "PUT", { ...f.input("Legacy product"), hsCode: "001234" }, product._id)).status, 200);
  for (const hsCode of [1234, null, {}, "1".repeat(33)]) {
    assert.equal((await f.call("products", "POST", { ...f.input("Invalid code"), hsCode })).status, 400);
    assert.equal((await f.call("products", "PUT", { ...f.input("Legacy product"), hsCode }, product._id)).status, 400);
    assert.equal(f.stores.products[0].hsCode, "001234");
  }
  const invalidModel = new Product({ ...f.input("Invalid model"), hsCode: "1".repeat(33) });
  assert.ok(invalidModel.validateSync().errors.hsCode);
});

test("homepage booleans default off and Featured is no longer a product option", async () => {
  for (const [schema, Model] of [[validations.categorySchema, Category], [validations.productSchema, Product]]) {
    const input = { name: "Spices", slug: "spices", category: "a".repeat(24), featured: true };
    assert.equal(schema.parse(input).showOnHomepage, false);
    assert.equal("featured" in schema.parse(input), false);
    for (const enabled of [true, false]) {
      const record = new Model(schema.parse({ ...input, showOnHomepage: enabled }));
      await record.validate();
      assert.equal(record.showOnHomepage, enabled);
    }
    for (const value of ["true", "false", 1, null]) assert.equal(schema.safeParse({ ...input, showOnHomepage: value }).success, false);
  }
});

for (const kind of ["categories", "products"]) {
  const singular = kind === "categories" ? "category" : "product";
  test(`${kind}: limit applies to creation, editing, and switches; disabling frees a place`, async () => {
    const f = await fixture();
    for (let i = 0; i < 10; i++) assert.equal((await f.call(kind, "POST", f.input(`Item ${i}`, true))).status, 201);
    assert.equal((await f.call(kind, "POST", f.input("Overflow", true))).status, 409);
    const created = await f.call(kind, "POST", f.input("Hidden"));
    assert.equal(created.status, 201);
    const hidden = (await created.json())[singular];
    assert.equal((await f.call(kind, "PUT", f.input("Hidden", true), hidden._id)).status, 409);
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: true }, hidden._id)).status, 409);
    const selected = f.stores[kind].find(row => row.showOnHomepage);
    assert.equal((await f.call(kind, "PUT", f.input("Renamed", true), selected._id)).status, 200);
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: false }, selected._id)).status, 200);
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: true }, hidden._id)).status, 200);
    assert.equal(f.stores[kind].filter(row => row.showOnHomepage).length, 10);
    assert.equal(f.stores[kind].find(row => row._id === hidden._id).description, "Original details");
    assert.equal(f.invalidations(), 14);
  });

  test(`${kind}: concurrent additions compete for the last place`, async () => {
    const f = await fixture();
    for (let i = 0; i < 9; i++) await f.call(kind, "POST", f.input(`Item ${i}`, true));
    const results = await Promise.all([f.call(kind, "POST", f.input("Contender A", true)), f.call(kind, "POST", f.input("Contender B", true))]);
    assert.deepEqual(results.map(response => response.status).sort(), [201, 409]);
    assert.equal(f.stores[kind].filter(row => row.showOnHomepage).length, 10);
  });

  test(`${kind}: filters combine with search and pagination, while the count stays global`, async () => {
    const f = await fixture();
    for (let i = 0; i < 18; i++) await f.call(kind, "POST", f.input(`Match ${i}`, i < 4));
    const page = await (await f.call(kind, "GET", null, "", "homepage=no&search=Match&page=2&limit=5")).json();
    assert.equal(page.total, 14);
    assert.equal(page.totalPages, 3);
    assert.equal(page[kind].length, 5);
    assert.ok(page[kind].every(row => !row.showOnHomepage));
    assert.equal(page.homepageCount, 4);
    const selected = await (await f.call(kind, "GET", null, "", "homepage=yes&search=Match%201")).json();
    assert.equal(selected.total, 1);
    assert.equal(selected.homepageCount, 4);
    assert.equal((await f.call(kind, "GET", null, "", "homepage=invalid")).status, 400);
    if (kind === "products") {
      const category = (await (await f.call("categories", "POST", f.input("Other category"))).json()).category;
      await f.call(kind, "POST", { ...f.input("Match other", true), category: category._id });
      const filtered = await (await f.call(kind, "GET", null, "", "homepage=yes&search=Match&category=other-category")).json();
      assert.equal(filtered.total, 1);
      assert.equal(filtered.homepageCount, 5);
    }
  });

  test(`${kind}: legacy excess selections are preserved, can be reduced, and never display more than ten`, async () => {
    const f = await fixture();
    const Model = kind === "categories" ? Category : Product;
    f.stores[kind].push(...Array.from({ length: 12 }, (_, i) => clone(new Model(f.input(`Legacy ${i}`, true)).toObject())));
    const legacy = clone(new Model(f.input("Unset")).toObject());
    delete legacy.showOnHomepage;
    f.stores[kind].push(legacy);
    const list = await (await f.call(kind, "GET", null, "", "homepage=no")).json();
    assert.ok(list[kind].some(row => row._id === legacy._id));
    assert.equal(list.homepageCount, 12);
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: true }, legacy._id)).status, 409);
    const homepage = await (kind === "categories" ? f.data.getHomepageCategories() : f.data.getHomepageProducts());
    assert.equal(homepage.length, 10);
    assert.equal(f.stores[kind].filter(row => row.showOnHomepage).length, 12);
    const selected = f.stores[kind].find(row => row.showOnHomepage);
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: false }, selected._id)).status, 200);
    assert.equal(f.stores[kind].filter(row => row.showOnHomepage).length, 11);
  });

  test(`${kind}: switch validation, authorization, and failure leave saved content intact`, async () => {
    const f = await fixture();
    const record = (await (await f.call(kind, "POST", f.input("Private"))).json())[singular];
    for (const body of [{ showOnHomepage: "false" }, {}, { showOnHomepage: true, name: "Overwrite" }]) {
      assert.equal((await f.call(kind, "PATCH", body, record._id)).status, 400);
    }
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: true }, "invalid")).status, 400);
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: true }, "b".repeat(24))).status, 404);
    f.fail();
    assert.equal((await f.call(kind, "PATCH", { showOnHomepage: true }, record._id)).status, 500);
    assert.equal(f.stores[kind].find(row => row._id === record._id).showOnHomepage, false);
    f.deny();
    for (const method of ["PATCH", "PUT", "POST"]) assert.equal((await f.call(kind, method, f.input("Unauthorized", true), record._id)).status, 401);
    assert.equal(f.invalidations(), 1);
  });
}
