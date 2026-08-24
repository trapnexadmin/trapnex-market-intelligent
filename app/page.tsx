'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Gauge,
  LayoutDashboard,
  ListFilter,
  Newspaper,
  Radar,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Info,
  Star,
  AlertTriangle,
} from 'lucide-react';

const caps: Array<[string, number, number, string]> = [];
const sectors: Array<[string, number, number]> = [];
const opportunities: any[] = [];
const dangers: any[] = [];

const defaultPulse = {
  score: null,
  direction: 'INSUFFICIENT_DATA',
  confidence: 0,
  factors: [],
  calculatedAt: new Date().toISOString(),
  dataFreshnessSeconds: null,
  sourceCount: 0,
};

const nav=[['TERMINAL',[['Dashboard',LayoutDashboard],['Market Pulse',Gauge],['Live Market',Activity],['Market Breadth',ChartNoAxesCombined],['Sector Pulse',TrendingUp]]],['DISCOVER',[['Opportunities',Target],['Stocks',Search],['Screener',ListFilter],['IPO Radar',Sparkles],['Watchlist',Radar]]],['INTELLIGENCE',[['News Center',Newspaper],['Danger Radar',ShieldAlert]]],['MY MONEY',[['Portfolio',BriefcaseBusiness],['Alerts',Bell]]]];
export default function Page(){
  const [pulse, setPulse] = useState<typeof defaultPulse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPulse() {
      try {
        const response = await fetch('/api/market/pulse');
        if (!response.ok) {
          throw new Error(`Pulse request failed: ${response.status}`);
        }
        const payload = (await response.json()) as { pulse?: typeof defaultPulse | null };
        if (active) setPulse(payload.pulse ?? null);
      } catch {
        if (active) setPulse(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPulse();
    return () => { active = false; };
  }, []);

  const marketPulse = pulse ?? defaultPulse;

  return <div className="shell"><aside><div className="brand"><Image src="/trapnex-logo.png" alt="TRAPNEX" width={178} height={112}/></div>{nav.map(([section,items]:any)=><div className="navsec" key={section}><label>{section}</label>{items.map(([n,I]:any)=><button className={n==='Dashboard'?'active':''} key={n}><I size={16}/>{n}</button>)}</div>)}<button className="settings"><Settings size={16}/>Settings</button></aside><main><header><div className="search"><Search size={16}/>Search stock, company, sector... <kbd>/</kbd></div><div className="live"><i/> NSE/BSE LIVE <small>15:29:42 IST</small><Bell size={17}/><span className="avatar">GA</span><b>Gokul A.<small>Retail Pro</small></b></div></header><div className="ticker">{[['NIFTY 50','24,852.15','+0.58%'],['SENSEX','81,724.80','+0.59%'],['BANK NIFTY','51,940.60','+0.61%'],['INDIA VIX','13.42','-3.18%'],['NIFTY MIDCAP 100','58,420.75','+0.85%'],['NIFTY SMALLCAP 100','18,320.40','-0.57%']].map(x=><div><small>{x[0]}</small><strong>{x[1]}</strong><em className={x[2].startsWith('-')?'red':'green'}>{x[2]}</em></div>)}<div><small>MARKET STATUS</small><strong className="green">● OPEN</strong><em>Closes 15:30</em></div></div><section className="content"><div className="intro"><div><label>TRAPNEX · MARKET INTELLIGENCE</label><h1>See the market before it moves.</h1><p>AI-powered intelligence for Indian investors — market context, opportunities, risk and portfolio decisions in one explainable system.</p></div><span className="open">● MARKET OPEN · 15:29 IST</span></div><div className="topgrid"><Panel title="NIFTY TREND PULSE"><div className="pulse"><div><strong>{marketPulse.score ?? '—'}{marketPulse.score !== null ? <small>/100</small> : null}</strong><b className={marketPulse.direction === 'BULLISH' ? 'green' : marketPulse.direction === 'BEARISH' ? 'red' : 'amber'}>{marketPulse.direction}</b><span className={marketPulse.score !== null ? 'green' : 'muted'}>{marketPulse.score !== null ? `▲ ${marketPulse.score} today` : loading ? 'Loading live pulse...' : 'No live market data is available yet.'}</span></div><div className="factors">{marketPulse.factors.length ? marketPulse.factors.map((factor:any)=><div key={factor.key}><span>{factor.label}</span><i><em style={{width:`${factor.score === null ? 0 : factor.score}%`}}/></i><b>{factor.score === null ? '—' : factor.score}</b></div>) : <div><span>Live signal</span><i><em style={{width:'0%'}}/></i><b>—</b></div>}</div></div><div className="ai"><Sparkles size={14}/><span><b>AI Interpretation</b><br/>{marketPulse.score !== null ? 'Live pulse data is being received from the configured market feed.' : 'Live market observations are not configured yet; the system is waiting for provider data.'}</span></div></Panel><Panel title="CAPITAL ROTATION" link="More →"><div className="caps">{caps.map(([n,s,c,state]:any)=><div className={s<55?'cap warn':'cap'}><small>{n.toUpperCase()} <span className={c>=0?'green':'red'}>{c>=0?'▲':'▼'} {Math.abs(c)}</span></small><strong>{s}<i>/100</i></strong><b className={s>=70?'green':s>=55?'amber':'muted'}>{state}</b><i className="mini"><em style={{width:`${s}%`}}/></i></div>)}</div><div className="ai-line">✦ AI: Defensive rotation detected. Capital is favoring large caps.</div></Panel><Panel title="SECTOR PULSE" link="TOP 9"><div className="sector-head"><span>Sector</span><span>Score</span><span>Change</span></div>{sectors.map(([n,s,c]:any)=><div className="sector"><span>{n}</span><i><em className={s<50?'bad':s<60?'amberbar':''} style={{width:`${s}%`}}/></i><b className={s<50?'red':s<60?'amber':'green'}>{s}</b><span className={c>=0?'green':'red'}>{c>=0?'▲':'▼'} {Math.abs(c)}</span></div>)}</Panel><Panel title="MARKET BREADTH"><div className="breadth"><p>Advancers <b className="green">318 (64%)</b></p><p className="red">Decliners <b className="red">142 (28%)</b></p><p>Unchanged <b>40 (8%)</b></p><hr/><p>A/D Ratio <strong>2.24</strong></p><b className="green">Strong</b><p>Above 20 DMA <b>68%</b></p><p>Above 50 DMA <b>61%</b></p><p>Above 200 DMA <b>57%</b></p></div></Panel></div><div className="bottomgrid"><Panel title="TOP OPPORTUNITIES · 10%+ EXPECTED RETURN" link="View all →"><div className="opphead">Stock · Score · Expected Return · Entry · Target · Risk · Confidence</div>{opportunities.map((o:any)=><div className="opp"><div><b>{o[0]}</b><small>{o[1]}</small></div><strong className="chip">{o[2]}</strong><b className="green">{o[3]}</b><span>{o[4]}</span><span>{o[5]}</span><span className="risk">{o[6]}</span><span>{o[7]}%</span><Star size={14}/></div>)}<div className="filters">Min expected return: <button>Any</button><button>5%+</button><button className="selected">10%+</button><button>15%+</button><button>20%+</button></div></Panel><Panel title="DANGER RADAR" link="TOP 5"><div>{dangers.map((d:any)=><div className="danger"><span className={d[1]==='HIGH'?'dangericon high':'dangericon'}><AlertTriangle size={14}/></span><div><b>{d[0]} <small className={d[1]==='HIGH'?'red':'amber'}>{d[1]}</small></b><p>{d[3]}</p></div><small>{d[2]}</small></div>)}</div></Panel><Panel title="PORTFOLIO SUMMARY" link="View portfolio →"><div className="portfolio"><div><small>Total Value</small><strong>₹10,24,850</strong></div><div><small>Today's P&L</small><strong className="green">+₹12,430 (+1.22%)</strong></div><div className="chart"/><div className="health"><strong>78<small>/100</small></strong><span>GOOD</span></div><div className="healthbars">{[['Diversification',82],['Risk',71],['Quality',84],['Momentum',79],['Sector Balance',68]].map(x=><p><span>{x[0]}</span><i><em style={{width:`${x[1]}%`}}/></i><b>{x[1]}</b></p>)}</div></div></Panel></div><div className="news"><b>MARKET NEWS</b><span>15:10 RBI keeps repo rate unchanged at 6.5%</span><span>14:58 M&M receives major order from defence ministry</span><span>14:42 HDFC Bank Q2 PAT up 12% YoY</span><span>14:28 Crude oil hits 3-month high</span><strong>View all news →</strong></div><footer>TRAPNEX Market Intelligence · Demo intelligence layer · Replace demo data with configured provider adapters before production.</footer></section></main></div>}
function Panel({title,link,children}:{title:string,link?:string,children:React.ReactNode}){return <section className="panel"><div className="head"><span>{title} <Info size={13}/></span><b>{link}</b></div>{children}</section>}
