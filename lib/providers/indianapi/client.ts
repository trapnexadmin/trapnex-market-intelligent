const baseUrl = process.env.INDIANAPI_BASE_URL || "https://stock.indianapi.in";

export async function indianApiRequest(path: string, params?: Record<string, string>) {
  const apiKey = process.env.INDIANAPI_API_KEY;
  if (!apiKey) throw new Error("INDIANAPI_API_KEY is not configured");

  const url = new URL(path, baseUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: { "x-api-key": apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`IndianAPI ${response.status}`);
  return response.json();
}
