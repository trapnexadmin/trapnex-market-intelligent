import type {
  MarketNewsContext,
  MarketNewsEvent,
} from "./market-types";

function envBoolean(name: string) {
  return process.env[name] === "true";
}

function textValue(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function numberValue(value: unknown) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
}

export async function getMarketNewsContext(): Promise<MarketNewsContext> {
  const checkedAt = new Date().toISOString();

  // Provider boundary is intentionally disabled until an approved
  // production market-news source is configured. No synthetic events.
  if (!envBoolean("MARKET_NEWS_ENABLED")) {
    return {
      globalDanger: null,
      indiaDanger: null,
      events: [],
      provider: null,
      checkedAt,
      errors: ["MARKET_NEWS_NOT_CONFIGURED"],
    };
  }

  const endpoint = textValue(process.env.MARKET_NEWS_ENDPOINT);
  if (!endpoint) {
    return {
      globalDanger: null,
      indiaDanger: null,
      events: [],
      provider: null,
      checkedAt,
      errors: ["MARKET_NEWS_ENDPOINT_MISSING"],
    };
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        ...(process.env.MARKET_NEWS_API_KEY
          ? { Authorization: `Bearer ${process.env.MARKET_NEWS_API_KEY}` }
          : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`MARKET_NEWS_HTTP_${response.status}`);
    }

    const payload = await response.json();
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.events)
        ? payload.events
        : [];

    const events: MarketNewsEvent[] = rows
      .map((row: any, index: number) => {
        const title = textValue(row?.title);
        const publishedAt =
          textValue(row?.publishedAt) ??
          textValue(row?.published_at) ??
          checkedAt;

        if (!title) return null;

        const scope =
          String(row?.scope ?? "").toUpperCase() === "GLOBAL"
            ? "GLOBAL"
            : "INDIA";

        return {
          id: String(row?.id ?? `${scope}-${index}-${title}`),
          scope,
          title,
          summary:
            textValue(row?.summary) ??
            textValue(row?.description),
          url: textValue(row?.url),
          source: textValue(row?.source) ?? "UNKNOWN",
          publishedAt,
          dangerScore: numberValue(
            row?.dangerScore ?? row?.danger_score,
          ),
        } satisfies MarketNewsEvent;
      })
      .filter(Boolean) as MarketNewsEvent[];

    const score = (scope: "GLOBAL" | "INDIA") => {
      const values = events
        .filter((event) => event.scope === scope)
        .map((event) => event.dangerScore)
        .filter((value): value is number => value !== null);

      return values.length
        ? Math.round(
            (values.reduce((a, b) => a + b, 0) / values.length) * 10,
          ) / 10
        : null;
    };

    return {
      globalDanger: score("GLOBAL"),
      indiaDanger: score("INDIA"),
      events,
      provider: textValue(response.headers.get("x-provider")) ?? "MARKET_NEWS",
      checkedAt,
      errors: [],
    };
  } catch (error) {
    return {
      globalDanger: null,
      indiaDanger: null,
      events: [],
      provider: null,
      checkedAt,
      errors: [
        error instanceof Error
          ? error.message
          : "MARKET_NEWS_PROVIDER_ERROR",
      ],
    };
  }
}
