type Opportunity={symbol:string;score:number|null;expectedReturnPct:number|null;downsidePct:number|null;riskReward:number|null;decision:string;confidence:number};

export default function OpportunityTable({items}:{items:Opportunity[]}){
  return <div className="opportunity-table">
    <div className="opportunity-row opportunity-head"><b>Stock</b><b>Score</b><b>Return</b><b>Risk/Reward</b><b>Confidence</b><b>Decision</b></div>
    {items.map(item=><div className="opportunity-row" key={item.symbol}>
      <strong>{item.symbol}</strong>
      <span>{item.score??"—"}</span>
      <span>{item.expectedReturnPct==null?"—":`${item.expectedReturnPct.toFixed(1)}%`}</span>
      <span>{item.riskReward==null?"—":item.riskReward.toFixed(2)}</span>
      <span>{item.confidence}%</span>
      <b>{item.decision}</b>
    </div>)}
  </div>
}
