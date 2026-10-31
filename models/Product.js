import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: [true, "Category is required"] },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    showOnHomepage: { type: Boolean, default: false },
    description: { type: String, default: "" },
    hsCode: { type: String, default: "", trim: true, maxlength: 32 },
    packagingDetails: { type: String, default: "" },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
