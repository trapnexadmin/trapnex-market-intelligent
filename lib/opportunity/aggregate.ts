import {calculateOpportunity} from "./calculate";
import type {Opportunity} from "./types";
import type {ProviderContext} from "./provider-adapters";
import {buildTechnicalPlan} from "./technical-plan";

export function aggregateProviderContext(
  symbol:string,
  context:ProviderContext,
  candles:{high:number;low:number;close:number}[]=[],
):Opportunity{
  const plan=context.entry!==null&&context.target!==null&&context.stopLoss!==null
    ? {entry:context.entry,target:context.target,stopLoss:context.stopLoss}
    : buildTechnicalPlan(candles);

  const expectedReturnPct=
    plan.entry!==null&&plan.target!==null&&plan.entry>0
      ? ((plan.target-plan.entry)/plan.entry)*100
      : null;

  const downsidePct=
    plan.entry!==null&&plan.stopLoss!==null&&plan.entry>0
      ? ((plan.entry-plan.stopLoss)/plan.entry)*100
      : null;

  return calculateOpportunity({
    symbol,
    stockScore:context.stockScore,
    stockConfidence:context.stockConfidence,
    marketPulse:context.marketPulse,
    sectorPulse:context.sectorPulse,
    expectedReturnPct,
    downsidePct,
    riskShield:context.riskShield,
    liquidityScore:context.liquidityScore,
  });
}
