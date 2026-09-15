import type { InstrumentClassification } from "./types";

let persisted: InstrumentClassification[] = [];

export function saveClassifications(rows: InstrumentClassification[]) {
  persisted = rows.map((row) => ({ ...row }));
  return persisted;
}

export function loadClassifications(): InstrumentClassification[] {
  return persisted.map((row) => ({ ...row }));
}
