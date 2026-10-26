import mongoose from "mongoose";
import HomepageSelectionLock from "@/models/HomepageSelectionLock";
import { HOMEPAGE_LIMIT } from "@/lib/homepage-settings";

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

    if (values.showOnHomepage === true && existing?.showOnHomepage !== true) {
      const count = await Model.countDocuments({ showOnHomepage: true }).session(session);
      if (count >= HOMEPAGE_LIMIT) {
        throw Object.assign(new Error(`The homepage already has ${count} ${Model.modelName === "Category" ? "categories" : "products"} selected. Remove one homepage item before adding another (maximum ${HOMEPAGE_LIMIT}).`), { status: 409 });
      }
    }

    if (id) return Model.findByIdAndUpdate(id, { $set: values }, { new: true, runValidators: true, session }).lean();
    const [record] = await Model.create([values], { session });
    return record.toObject();
  }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
}
