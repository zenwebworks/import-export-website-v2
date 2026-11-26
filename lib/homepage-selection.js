import mongoose from "mongoose";
import HomepageSelectionLock from "@/models/HomepageSelectionLock";
import { HOMEPAGE_LIMIT } from "@/lib/homepage-settings";
import { catalogueAddress } from "@/lib/catalogue-address";

async function resolveAddress(Model, name, existing, confirmedSlug, session) {
  const kind = Model.modelName.toLowerCase();
  const base = catalogueAddress(name, kind, existing);
  if (!base) throw Object.assign(new Error("Include at least one letter or number in the name."), { status: 400 });
  if (base === existing?.slug) return base;
  const owner = await Model.findOne({ slug: base }).select("name").session(session).lean();
  if (!owner) return base;

  // The generated base contains only ASCII letters, digits and hyphens.
  const siblings = await Model.find({ slug: { $regex: `^${base}-[0-9]+$` } }).select("slug").session(session).lean();
  const used = new Set(siblings.map(row => row.slug));
  used.delete(existing?.slug);
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix++;
  const suggestedSlug = `${base}-${suffix}`;
  if (confirmedSlug === suggestedSlug) return suggestedSlug;
  throw Object.assign(new Error(`“${owner.name}” already uses this link. If this is a separate ${kind}, save with the suggested link below.`), { status: 409, suggestedSlug });
}

export async function saveCatalogueRecord(Model, values, id) {
  // Initialize outside the transaction so simultaneous first writes can retry safely.
  try {
    await HomepageSelectionLock.updateOne({ _id: Model.modelName }, { $setOnInsert: { revision: 0 } }, { upsert: true });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }

  return mongoose.connection.transaction(async session => {
    // Write before reading the count: competing transactions conflict and retry
    // with a fresh snapshot, rather than both claiming the tenth place.
    await HomepageSelectionLock.updateOne({ _id: Model.modelName }, { $inc: { revision: 1 } }, { session });
    const existing = id ? await Model.findById(id).session(session).lean() : null;
    if (id && !existing) throw Object.assign(new Error("Record no longer exists"), { status: 404 });

    const { confirmedSlug, ...fields } = values;
    if (fields.name !== undefined) fields.slug = await resolveAddress(Model, fields.name, existing, confirmedSlug, session);

    if (values.showOnHomepage === true && existing?.showOnHomepage !== true) {
      const count = await Model.countDocuments({ showOnHomepage: true }).session(session);
      if (count >= HOMEPAGE_LIMIT) {
        throw Object.assign(new Error(`The homepage already has ${count} ${Model.modelName === "Category" ? "categories" : "products"} selected. Remove one homepage item before adding another (maximum ${HOMEPAGE_LIMIT}).`), { status: 409 });
      }
    }

    if (id) return Model.findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true, session }).lean();
    const [record] = await Model.create([fields], { session });
    return record.toObject();
  }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
}
