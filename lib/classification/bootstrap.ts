import { loadLatestClassifications } from "./supabase";
import { listClassifications, replaceClassifications } from "./registry";

let attempted = false;

export async function ensureClassificationsLoaded() {
  if (attempted) return listClassifications();

  attempted = true;
  try {
    const rows = await loadLatestClassifications();
    if (rows?.length) replaceClassifications(rows);
  } catch {
    // Preserve the validated in-memory registry as a safe fallback.
  }

  return listClassifications();
}
