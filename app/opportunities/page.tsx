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
        <h2>Opportunity pipeline</h2>
        <p>
          Candidates appear only when verified stock, market, sector, risk,
          entry and return inputs are available.
        </p>
        <Link href="/stocks">Open Stock Intelligence →</Link>
      </section>
    </main>
  );
}
