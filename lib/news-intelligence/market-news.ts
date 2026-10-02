import type { MarketNewsContext, MarketNewsEvent } from "./market-types";

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

function eventDate(value: unknown) {
  const text = textValue(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isFinite(date.getTime()) ? date : null;
}

function maxAgeHours() {
  const configured = Number(process.env.MARKET_NEWS_MAX_AGE_HOURS ?? 24);
  return Number.isFinite(configured) ? Math.max(1, Math.min(configured, 168)) : 24;
}

export async function getMarketNewsContext(): Promise<MarketNewsContext> {
  const checkedAt = new Date().toISOString();

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

    if (!response.ok) throw new Error(`MARKET_NEWS_HTTP_${response.status}`);

    const payload = await response.json();
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.events)
        ? payload.events
        : null;

    if (!rows) {
      throw new Error("MARKET_NEWS_PAYLOAD_INVALID");
    }

    const cutoff = Date.now() - maxAgeHours() * 60 * 60 * 1000;
    const errors: string[] = [];

    const events = rows
      .map((row: any, index: number) => {
        const title = textValue(row?.title);
        if (!title) {
          errors.push(`EVENT_${index}_TITLE_MISSING`);
          return null;
        }

        const rawScope = String(row?.scope ?? "").toUpperCase();
        if (rawScope !== "GLOBAL" && rawScope !== "INDIA") {
          errors.push(`EVENT_${index}_SCOPE_INVALID`);
          return null;
        }

        const publishedAt = eventDate(row?.publishedAt ?? row?.published_at);
        if (!publishedAt) {
          errors.push(`EVENT_${index}_TIMESTAMP_INVALID`);
          return null;
        }

        if (publishedAt.getTime() < cutoff) return null;

        const dangerScore = numberValue(row?.dangerScore ?? row?.danger_score);
        if (dangerScore === null) {
          errors.push(`EVENT_${index}_DANGER_SCORE_INVALID`);
          return null;
        }

        return {
          id: String(row?.id ?? `${rawScope}-${index}-${title}`),
          scope: rawScope,
          title,
          summary: textValue(row?.summary) ?? textValue(row?.description),
          url: textValue(row?.url),
          source: textValue(row?.source) ?? "UNKNOWN",
          publishedAt: publishedAt.toISOString(),
          dangerScore,
        } satisfies MarketNewsEvent;
      })
      .filter(Boolean) as MarketNewsEvent[];

    const score = (scope: "GLOBAL" | "INDIA") => {
      const values = events
        .filter((event) => event.scope === scope)
        .map((event) => event.dangerScore);

      return values.length
        ? Math.round(
            (values.reduce((sum, value) => sum + value, 0) / values.length) * 10,
          ) / 10
        : null;
    };

    return {
      globalDanger: score("GLOBAL"),
      indiaDanger: score("INDIA"),
      events,
      provider:
        textValue(response.headers.get("x-provider")) ?? "MARKET_NEWS",
      checkedAt,
      errors,
    };
  } catch (error) {
    return {
      globalDanger: null,
      indiaDanger: null,
      events: [],
      provider: null,
      checkedAt,
      errors: [
        error instanceof Error ? error.message : "MARKET_NEWS_PROVIDER_ERROR",
      ],
    };
  }
}
