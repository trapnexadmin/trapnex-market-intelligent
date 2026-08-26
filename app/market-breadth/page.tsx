export default function MarketBreadthPage() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span>TERMINAL · BREADTH</span>
        <h1>Market Breadth</h1>
        <p>Advancers, decliners and participation breadth.</p>
      </div>
      <div className="page-card">
        <p>Live API: <code>/api/market/breadth?market=NIFTY500</code></p>
      </div>
    </main>
  );
}
