import { revalidateTag } from "next/cache";

export const CATALOGUE_TAG = "public-catalogue";
// Route handlers expire public DB reads immediately after a successful admin write.
export function invalidateCatalogue() { revalidateTag(CATALOGUE_TAG, { expire: 0 }); }
