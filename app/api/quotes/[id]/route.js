import { validObjectId } from "@/lib/request-params";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import QuoteRequest from "@/models/QuoteRequest";
import { requireAdmin } from "@/lib/api-auth";

export async function PATCH(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    const body = await request.json();
    const status = body?.status;
    if (!["new", "processed"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    await connectDB();
    const quote = await QuoteRequest.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!quote) return NextResponse.json({ error: "Quote request not found" }, { status: 404 });
    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update quote request" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    await connectDB();
    const quote = await QuoteRequest.findByIdAndDelete(id);
    if (!quote) return NextResponse.json({ error: "Quote request not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete quote request" }, { status: 500 });
  }
}
