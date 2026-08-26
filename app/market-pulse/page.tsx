import Link from "next/link";

export default function MarketPulsePage() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span>TERMINAL · MARKET</span>
        <h1>Market Pulse</h1>
        <p>NIFTY trend intelligence and market regime.</p>
      </div>
      <div className="page-card">
        <p>Live API: <code>/api/market/nifty-pulse</code></p>
        <Link href="/">Back to dashboard</Link>
      </div>
    </main>
  );
}
