import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { connectDB } from "@/lib/db";
import { validObjectId } from "@/lib/request-params";
import { invalidateCatalogue } from "@/lib/catalogue-cache";
import { saveCatalogueRecord } from "@/lib/homepage-selection";
import { homepageVisibilitySchema } from "@/lib/validations";

export function homepagePatch(Model, normalize, key) {
  return async (request, { params }) => {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    try {
      const { id } = await params;
      if (!validObjectId(id)) return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
      const parsed = homepageVisibilitySchema.safeParse(await request.json());
      if (!parsed.success) return NextResponse.json({ error: "Provide only a boolean Show on Homepage setting." }, { status: 400 });
      await connectDB();
      const record = await saveCatalogueRecord(Model, parsed.data, id);
      if (Model.modelName === "Product") await Model.populate(record, { path: "category", select: "name slug image description" });
      invalidateCatalogue();
      return NextResponse.json({ [key]: normalize(record) });
    } catch (error) {
      return NextResponse.json({ error: error.status ? error.message : "Failed to update homepage visibility" }, { status: error.status || 500 });
    }
  };
}
