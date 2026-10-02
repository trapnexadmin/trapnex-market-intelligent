import { loadLatestUniverse } from "./supabase";
import { replaceUniverse, listUniverse } from "./registry";
let attempted = false;
export async function ensureUniverseLoaded() {
  if (attempted) return listUniverse({ activeOnly: false });
  attempted = true;
  try { const rows = await loadLatestUniverse(); if (rows?.length) replaceUniverse(rows); } catch { /* validated in-memory fallback */ }
  return listUniverse({ activeOnly: false });
}
