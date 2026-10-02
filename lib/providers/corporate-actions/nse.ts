import type { CorporateAction } from "./types";

const URL = "https://www.nseindia.com/companies-listing/corporate-filings-application";

function classify(purpose: string): CorporateAction["type"] {
  const p = purpose.toUpperCase();
  if (p.includes("DIVIDEND")) return "DIVIDEND";
  if (p.includes("BONUS")) return "BONUS";
  if (p.includes("SPLIT") || p.includes("SUB-DIVISION")) return "SPLIT";
  if (p.includes("RIGHTS")) return "RIGHTS";
  if (p.includes("DEMERGER")) return "DEMERGER";
  if (p.includes("BUYBACK")) return "BUYBACK";
  return "OTHER";
}

export async function getNseCorporateActions(symbol: string): Promise<CorporateAction[]> {
  const response = await fetch(
    `${URL}?id=equity&symbol=${encodeURIComponent(symbol.toUpperCase())}`,
    {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) throw new Error(`NSE_CORPORATE_ACTIONS_${response.status}`);

  const html = await response.text();
  const rows = [...html.matchAll(/<tr[^>]*>[^]*?<\/tr>/gi)].map((m) => m[0]);

  return rows
    .map((row, index) => {
      const cells = [...row.matchAll(/<t[dh][^>]*>([^<]*)<\/[th]>/gi)].map((m) =>
        m[1].replace(/&amp;/g, "&").trim(),
      );

      if (cells.length < 4) return null;

      const [rowSymbol, companyName, , purpose, , exDate, recordDate] = cells;
      if (String(rowSymbol).toUpperCase() !== symbol.toUpperCase()) return null;

      return {
        id: `${symbol}-${index}-${exDate ?? ""}`,
        symbol: symbol.toUpperCase(),
        companyName: companyName || null,
        type: classify(purpose || ""),
        purpose: purpose || "",
        exDate: exDate || null,
        recordDate: recordDate || null,
        announcementDate: null,
        source: "NSE",
        url: `${URL}?id=equity&symbol=${encodeURIComponent(symbol.toUpperCase())}`,
      } satisfies CorporateAction;
    })
    .filter(Boolean) as CorporateAction[];
}
