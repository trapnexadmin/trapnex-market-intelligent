import Link from "next/link";
export default function DangerPage(){
  return <main className="page-shell">
    <div className="page-header"><span>INTELLIGENCE · RISK</span><h1>Danger Radar</h1><p>AI-assisted event impact and trap-risk signals.</p></div>
    <div className="page-card"><p>Stock API: <code>/api/danger?symbol=RELIANCE</code></p><Link href="/stocks/RELIANCE">Open stock intelligence →</Link></div>
  </main>
}
