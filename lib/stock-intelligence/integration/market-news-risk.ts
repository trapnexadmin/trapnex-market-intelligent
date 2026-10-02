import { getMarketNewsContext } from "@/lib/news-intelligence/market-news";

export async function getMarketNewsRiskShield() {
  const context = await getMarketNewsContext();

  const values = [context.globalDanger, context.indiaDanger].filter(
    (value): value is number => value !== null,
  );

  if (!values.length) {
    return {
      shield: null,
      context,
    };
  }

  const danger = values.reduce((sum, value) => sum + value, 0) / values.length;

  return {
    shield: Math.round(Math.max(0, Math.min(100, 100 - danger)) * 10) / 10,
    context,
  };
}
