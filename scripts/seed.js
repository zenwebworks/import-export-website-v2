require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seed() {
  const { MONGODB_URI } = process.env;

  const ADMIN_NAME = "Admin";
  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "admin@123";

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it to .env.local.");
    process.exit(1);
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`Admin with email "${email}" already exists. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.create({ name: ADMIN_NAME || "Admin", email, password });
  console.log(`Admin user created: ${email}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
