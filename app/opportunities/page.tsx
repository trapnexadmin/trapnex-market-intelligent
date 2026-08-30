import Link from "next/link";

export default function OpportunitiesPage() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span>DISCOVER · OPPORTUNITIES</span>
        <h1>Opportunity Engine</h1>
        <p>Risk-adjusted candidates targeting 10%+ expected return.</p>
      </div>
      <section className="page-card">
        <h2>Verified-input gate</h2>
        <p>
          The engine only promotes a stock when the underlying score, market
          regime, sector strength, expected return and risk inputs are verified.
        </p>
        <Link href="/stocks">Open Stock Intelligence →</Link>
      </section>
    </main>
  );
}
