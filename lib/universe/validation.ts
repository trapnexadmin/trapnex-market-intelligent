import type { EquityUniverseRow } from "./types";

export interface UniverseValidation {
  valid: boolean;
  accepted: number;
  rejected: number;
  errors: string[];
}

export function validateUniverse(rows: EquityUniverseRow[]): UniverseValidation {
  const errors: string[] = [];
  let accepted = 0;
  let rejected = 0;

  for (const row of rows) {
    const rowErrors: string[] = [];

    if (!row.symbol) rowErrors.push("SYMBOL_MISSING");
    if (!row.companyName) rowErrors.push("COMPANY_NAME_MISSING");
    if (!row.providerSymbol) rowErrors.push("PROVIDER_SYMBOL_MISSING");
    if (!row.source || row.source === "UNKNOWN") rowErrors.push("SOURCE_MISSING");
    if (!row.listed) rowErrors.push("NOT_LISTED");

    if (rowErrors.length) {
      rejected++;
      errors.push(`${row.symbol || "UNKNOWN"}:${rowErrors.join(",")}`);
    } else {
      accepted++;
    }
  }

  return {
    valid: rejected === 0,
    accepted,
    rejected,
    errors,
  };
}
