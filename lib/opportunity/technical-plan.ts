export interface Candle{high:number;low:number;close:number}

export function buildTechnicalPlan(candles:Candle[]){
  const valid=candles.filter(c=>Number.isFinite(c.high)&&Number.isFinite(c.low)&&Number.isFinite(c.close));
  if(valid.length<20)return {entry:null,stopLoss:null,target:null,support:null,resistance:null,valid:false};

  const recent=valid.slice(-20);
  const support=Math.min(...recent.map(c=>c.low));
  const resistance=Math.max(...recent.map(c=>c.high));
  const close=recent.at(-1)!.close;

  const entry=Math.max(close,resistance);
  const risk=entry-support;
  if(risk<=0)return {entry:null,stopLoss:null,target:null,support,resistance,valid:false};

  return {
    entry,
    stopLoss:support,
    target:entry+risk*2,
    support,
    resistance,
    valid:true,
  };
}
