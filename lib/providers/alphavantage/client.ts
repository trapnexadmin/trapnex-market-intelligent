const BASE = "https://www.alphavantage.co/query";

export async function alphaVantageRequest<T>(
  params: Record<string, string>,
): Promise<T> {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) throw new Error("ALPHAVANTAGE_API_KEY is not configured");
  const url = new URL(BASE);
  Object.entries({ ...params, apikey: apiKey }).forEach(([k, v]) =>
    url.searchParams.set(k, v),
  );
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Alpha Vantage ${response.status}`);
  return response.json() as Promise<T>;
}
