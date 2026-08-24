import StockIntelligencePanel from "@/components/stock-intelligence/StockIntelligencePanel";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  return <StockIntelligencePanel symbol={decodeURIComponent(symbol)} />;
}
