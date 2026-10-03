import { z } from "zod";

const baseSchema = z.object({
  buyer_name: z.string().trim().min(2, "Please enter your name").max(100),
  company_name: z.string().trim().min(2, "Company name is required").max(150),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(5, "Phone number is required").max(30),
  country: z.string().trim().min(2, "Country is required").max(80),
  product: z.string().trim().optional().or(z.literal("")),
  quantity: z.string().trim().min(1, "Quantity is required").max(80),
  delivery_port: z.string().trim().min(2, "Delivery port / city is required").max(120),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

function notesPrefix({ service = "export", category = "" } = {}) {
  if (service !== "import") return "";
  return `Import enquiry — destination: India\n${category ? `Category: ${category}\n` : ""}\n`;
}

export function quoteNotesLimit(context) {
  return 2000 - notesPrefix(context).length;
}

export function createQuoteFormSchema(context = {}) {
  if (context.service !== "import") return baseSchema;
  return baseSchema.extend({
    product_name: z.string().trim().min(2, "Please describe the product you want to import").max(200),
    notes: z.string().trim().max(quoteNotesLimit(context)).optional().or(z.literal("")),
  });
}

// Preserve the existing API shape: import requests use a custom product name
// and retain their service/category context in the existing notes field.
export function buildQuotePayload(data, { service = "export", category = "", selectedProduct = null } = {}) {
  const isImport = service === "import";
  return {
    buyerName: data.buyer_name,
    companyName: data.company_name,
    email: data.email,
    phone: data.phone,
    country: data.country,
    product: isImport ? "" : data.product || "",
    productNameSnapshot: isImport ? data.product_name : selectedProduct?.name || "",
    quantity: data.quantity,
    deliveryPort: data.delivery_port,
    notes: notesPrefix({ service, category }) + (data.notes || ""),
  };
}
