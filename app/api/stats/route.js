import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import QuoteRequest from "@/models/QuoteRequest";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const [
      totalCategories,
      totalProducts,
      totalQuotes,
      newQuotes,
      totalMessages,
      unreadMessages,
      recentQuotes,
      recentMessages,
    ] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      QuoteRequest.countDocuments(),
      QuoteRequest.countDocuments({ status: "new" }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "unread" }),
      QuoteRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({ totalCategories, totalProducts, totalQuotes, newQuotes, totalMessages, unreadMessages, recentQuotes, recentMessages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
