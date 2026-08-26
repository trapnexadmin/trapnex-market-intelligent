const BASE = "https://finnhub.io/api/v1";

export async function finnhubRequest<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error("FINNHUB_API_KEY is not configured");
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set("token", apiKey);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Finnhub ${response.status}`);
  return response.json() as Promise<T>;
}
