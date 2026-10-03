import { z } from "zod";

const emptyable = (schema) => schema.optional().or(z.literal(""));

export const quoteRequestSchema = z.object({
  buyerName: z.string().trim().min(2, "Please enter your full name").max(100),
  companyName: z.string().trim().min(2, "Please enter your company name").max(150),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().min(6, "Please enter a valid phone number").max(30),
  country: z.string().trim().min(2, "Please enter your country").max(80),
  product: emptyable(z.string().trim()),
  productNameSnapshot: emptyable(z.string().trim()),
  quantity: z.string().trim().min(1, "Please specify the quantity you need").max(80),
  deliveryPort: z.string().trim().min(2, "Please enter a delivery port or city").max(120),
  notes: emptyable(z.string().trim().max(2000)),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: emptyable(z.string().trim().max(150)),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: emptyable(z.string().trim().max(30)),
  message: z.string().trim().min(10, "Please enter a message of at least 10 characters").max(3000),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required").max(100),
  slug: z.string().trim().min(2, "Slug is required").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  description: emptyable(z.string().trim().max(1000)),
  image: z.object({ url: emptyable(z.string()), publicId: emptyable(z.string()) }).optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required").max(150),
  slug: z.string().trim().min(2, "Slug is required").max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  category: z.string().trim().min(1, "Please select a category"),
  image: z.object({ url: emptyable(z.string()), publicId: emptyable(z.string()) }).optional(),
  showOnHomepage: z.boolean().default(false),
  description: emptyable(z.string().trim().max(5000)),
  packagingDetails: emptyable(z.string().trim().max(3000)),
  featured: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
