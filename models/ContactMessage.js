import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: [true, "Email is required"], trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, required: [true, "Message is required"] },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
  },
  { timestamps: true },
);

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
