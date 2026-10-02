import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";
import { scoreNewsEventWithAI, aggregateDanger } from "@/lib/news-intelligence/score";
import { getCompanyCorporateActions } from "@/lib/news-intelligence/corporate-actions";

export interface StockNewsContext {
  events: Awaited<ReturnType<typeof getCompanyNewsEvents>>;
  dangerScore: number | null;
  corporateActions: Awaited<ReturnType<typeof getCompanyCorporateActions>>;
  corporateActionRisk: number | null;
  provider: string | null;
  errors: string[];
}

export async function loadStockNewsContext(symbol: string): Promise<StockNewsContext> {
  const errors: string[] = [];

  const [newsResult, corporateActions] = await Promise.all([
    getCompanyNewsEvents(symbol).catch((error) => {
      errors.push(
        error instanceof Error
          ? `NEWS:${error.message}`
          : "NEWS_PROVIDER_ERROR",
      );
      return [];
    }),
    getCompanyCorporateActions(symbol).catch((error) => {
      errors.push(
        error instanceof Error
          ? `CORPORATE_ACTIONS:${error.message}`
          : "CORPORATE_ACTIONS_PROVIDER_ERROR",
      );
      return [];
    }),
  ]);

  const scoredEvents = await Promise.all(
    newsResult.map((event) =>
      scoreNewsEventWithAI(event).catch((error) => {
        errors.push(
          error instanceof Error
            ? `NEWS_AI:${error.message}`
            : "NEWS_AI_ERROR",
        );
        return null;
      }),
    ),
  );

  const events = scoredEvents.filter(Boolean) as Awaited<
    ReturnType<typeof scoreNewsEventWithAI>
  >[];

  const dangerScore = events.length
    ? aggregateDanger(symbol, events)
    : null;

  return {
    events,
    dangerScore,
    corporateActions,
    corporateActionRisk:
      corporateActions.length ? (
        corporateActions.reduce((sum, action) => {
          const risk =
            action.type === "DEMERGER" || action.type === "RIGHTS"
              ? 55
              : action.type === "BUYBACK"
                ? 30
                : action.type === "BONUS" || action.type === "SPLIT"
                  ? 15
                  : 10;
          return sum + risk;
        }, 0) / corporateActions.length
      ) : null,
    provider: events.length ? "Finnhub + AI" : null,
    errors,
  };
}
