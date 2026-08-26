import Link from "next/link";

const examples = [
  ["RELIANCE", "Reliance Industries"],
  ["TCS", "Tata Consultancy Services"],
  ["M&M", "Mahindra & Mahindra"],
];

export default function StocksPage() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span>DISCOVER · STOCKS</span>
        <h1>Stock Intelligence</h1>
        <p>Search a company and open its Trapnex intelligence workspace.</p>
      </div>
      <div className="page-card">
        <h2>Open stock workspace</h2>
        <div className="stock-links">
          {examples.map(([symbol, name]) => (
            <Link key={symbol} href={`/stocks/${encodeURIComponent(symbol)}`}>
              <strong>{symbol}</strong>
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
