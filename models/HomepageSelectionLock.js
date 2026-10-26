import mongoose from "mongoose";

// A shared document serializes selection changes across processes and admins.
const schema = new mongoose.Schema({
  _id: String,
  revision: { type: Number, default: 0 },
});

export default mongoose.models.HomepageSelectionLock || mongoose.model("HomepageSelectionLock", schema);
