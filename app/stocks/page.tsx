import Link from "next/link";

export default function StocksPage() {
  return (
    <main className="page-shell">
      <h1>Stocks</h1>
      <p>Search and open a stock intelligence workspace.</p>
      <div className="page-card">
        <Link href="/stocks/RELIANCE">Open RELIANCE</Link>
        <Link href="/stocks/TCS">Open TCS</Link>
        <Link href="/stocks/M%26M">Open M&amp;M</Link>
      </div>
    </main>
  );
}
