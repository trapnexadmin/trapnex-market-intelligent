export interface ReturnModelInput {
  entry:number|null;
  target:number|null;
  stopLoss:number|null;
}

export function modelExpectedReturn(input:ReturnModelInput){
  if(input.entry===null||input.target===null||input.stopLoss===null||
     !Number.isFinite(input.entry)||!Number.isFinite(input.target)||!Number.isFinite(input.stopLoss)||
     input.entry<=0||input.target<=input.entry||input.stopLoss>=input.entry){
    return {expectedReturnPct:null,downsidePct:null,riskReward:null,valid:false};
  }
  const expectedReturnPct=((input.target-input.entry)/input.entry)*100;
  const downsidePct=((input.entry-input.stopLoss)/input.entry)*100;
  return {
    expectedReturnPct,
    downsidePct,
    riskReward:downsidePct>0?expectedReturnPct/downsidePct:null,
    valid:true,
  };
}
