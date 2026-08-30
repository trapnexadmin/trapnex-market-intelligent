import NewsList from "@/components/news/NewsList";

export default function NewsPage() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span>INTELLIGENCE · NEWS</span>
        <h1>News Center</h1>
        <p>Company news with explainable event and risk scoring.</p>
      </div>
      <NewsList symbol="RELIANCE" />
    </main>
  );
}
