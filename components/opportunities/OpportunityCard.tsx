type Opportunity = {
  symbol: string;
  score: number | null;
  expectedReturnPct: number | null;
  downsidePct: number | null;
  riskReward: number | null;
  decision: string;
  confidence: number;
  reasons: string[];
};

export default function OpportunityCard({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  return (
    <article className="opportunity-card">
      <header>
        <strong>{opportunity.symbol}</strong>
        <b>{opportunity.decision}</b>
      </header>
      <div><span>Score</span><strong>{opportunity.score ?? "—"}</strong></div>
      <div>
        <span>Expected Return</span>
        <strong>
          {opportunity.expectedReturnPct == null
            ? "—"
            : `${opportunity.expectedReturnPct.toFixed(1)}%`}
        </strong>
      </div>
      <div>
        <span>Downside</span>
        <strong>
          {opportunity.downsidePct == null
            ? "—"
            : `${opportunity.downsidePct.toFixed(1)}%`}
        </strong>
      </div>
      <div>
        <span>Risk / Reward</span>
        <strong>
          {opportunity.riskReward == null
            ? "—"
            : opportunity.riskReward.toFixed(2)}
        </strong>
      </div>
      <div><span>Confidence</span><strong>{opportunity.confidence}%</strong></div>
      <ul>
        {opportunity.reasons.map((reason, index) => (
          <li key={`${index}-${reason}`}>{reason}</li>
        ))}
      </ul>
    </article>
  );
}
