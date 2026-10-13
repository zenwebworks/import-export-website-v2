import { parsePagination } from "@/lib/request-params";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactMessageSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";
import { sendContactMessageEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = contactMessageSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });

    await connectDB();
    const message = await ContactMessage.create(parsed.data);
    sendContactMessageEmail(message).catch(() => null);

    return NextResponse.json({ success: true, id: message._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit message" }, { status: error.status === 400 ? 400 : 500 });
  }
}

export async function GET(request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePagination(searchParams, 15, 50);
    const status = searchParams.get("status") || "";
    if (status && !["unread", "read"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(query),
    ]);

    return NextResponse.json({ messages, total, page, totalPages: Math.ceil(total / limit) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error.status === 400 ? error.message : "Failed to fetch messages" }, { status: error.status === 400 ? 400 : 500 });
  }
}
