import { validObjectId } from "@/lib/request-params";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/api-auth";

export async function PATCH(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    const body = await request.json();
    const status = body?.status;
    if (!["unread", "read"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    await connectDB();
    const message = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    await connectDB();
    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
