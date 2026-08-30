import {validateClassification,isFreshClassification} from "./validator";
import type {InstrumentClassification,ClassificationRefreshResult} from "./types";

export function validateRefresh(
  rows:InstrumentClassification[],
  source:string,
  effectiveDate:string|null,
):ClassificationRefreshResult{
  const errors:string[]=[];
  let accepted=0;
  let rejected=0;

  if(!source) errors.push("SOURCE_REQUIRED");
  if(!effectiveDate) errors.push("EFFECTIVE_DATE_REQUIRED");

  for(const row of rows){
    const result=validateClassification(row);
    if(!result.valid || !isFreshClassification(row)){
      rejected++;
      errors.push(`${row.exchange}:${row.symbol}:${result.errors.join(",")||"STALE_CLASSIFICATION"}`);
    }else accepted++;
  }

  return {
    status:accepted>0&&errors.length===0?"READY":accepted>0?"REJECTED":"INSUFFICIENT_DATA",
    accepted,
    rejected,
    source,
    effectiveDate,
    errors,
  };
}
