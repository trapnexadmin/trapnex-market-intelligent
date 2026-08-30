export function deriveReturnModel(entry:number|null,target:number|null,stopLoss:number|null){
  if(entry===null||target===null||stopLoss===null||entry<=0||target<=entry||stopLoss>=entry){
    return {expectedReturnPct:null,downsidePct:null,riskReward:null,valid:false};
  }
  const expectedReturnPct=((target-entry)/entry)*100;
  const downsidePct=((entry-stopLoss)/entry)*100;
  return {
    expectedReturnPct,
    downsidePct,
    riskReward:downsidePct>0?expectedReturnPct/downsidePct:null,
    valid:true,
  };
}
