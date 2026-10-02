const BASE = "https://api.upstox.com/v2";

export async function upstoxRequest(path: string, accessToken: string) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`UPSTOX_${response.status}`);
  return response.json();
}
