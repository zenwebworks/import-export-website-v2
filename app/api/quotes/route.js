import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import QuoteRequest from "@/models/QuoteRequest";
import { quoteRequestSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";
import { sendQuoteConfirmationEmail, sendQuoteRequestEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = quoteRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });

    await connectDB();
    let productId = parsed.data.product || null;
    let productNameSnapshot = parsed.data.productNameSnapshot || "";

    if (productId) {
      const query = /^[a-f\d]{24}$/i.test(productId) ? { _id: productId } : { slug: productId };
      const product = await Product.findOne(query).lean();
      if (product) {
        productId = product._id;
        productNameSnapshot = product.name;
      } else {
        productId = null;
      }
    }

    const quote = await QuoteRequest.create({
      buyerName: parsed.data.buyerName,
      companyName: parsed.data.companyName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      product: productId || null,
      productNameSnapshot,
      quantity: parsed.data.quantity,
      deliveryPort: parsed.data.deliveryPort,
      notes: parsed.data.notes || "",
    });

    Promise.allSettled([sendQuoteRequestEmail(quote), sendQuoteConfirmationEmail(quote)]).catch(() => null);
    return NextResponse.json({ success: true, id: quote._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 });
  }
}

export async function GET(request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "15", 10));
    const status = searchParams.get("status") || "";
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [quotes, total] = await Promise.all([
      QuoteRequest.find(query).populate("product", "name slug").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      QuoteRequest.countDocuments(query),
    ]);

    return NextResponse.json({ quotes, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quote requests" }, { status: 500 });
  }
}
