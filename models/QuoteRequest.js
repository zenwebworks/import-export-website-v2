import mongoose from "mongoose";

const QuoteRequestSchema = new mongoose.Schema(
  {
    buyerName: { type: String, required: [true, "Buyer name is required"], trim: true },
    companyName: { type: String, required: [true, "Company name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], trim: true, lowercase: true },
    phone: { type: String, required: [true, "Phone is required"], trim: true },
    country: { type: String, required: [true, "Country is required"], trim: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    productNameSnapshot: { type: String, default: "" },
    quantity: { type: String, required: [true, "Quantity is required"], trim: true },
    deliveryPort: { type: String, required: [true, "Delivery port / city is required"], trim: true },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["new", "processed"], default: "new" },
  },
  { timestamps: true },
);

export default mongoose.models.QuoteRequest || mongoose.model("QuoteRequest", QuoteRequestSchema);
