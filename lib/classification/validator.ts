import type {InstrumentClassification} from "./types";

export function validateClassification(row:InstrumentClassification){
  const errors:string[]=[];
  if(!/^[A-Z0-9&.-]+$/.test(row.symbol)) errors.push("INVALID_SYMBOL");
  if(row.exchange!=="NSE"&&row.exchange!=="BSE") errors.push("INVALID_EXCHANGE");
  if(row.capBucket===null) errors.push("MISSING_CAP_BUCKET");
  if(!row.sector) errors.push("MISSING_SECTOR");
  if(!row.source) errors.push("MISSING_SOURCE");
  if(!row.effectiveDate) errors.push("MISSING_EFFECTIVE_DATE");
  if(!row.asOf) errors.push("MISSING_AS_OF");
  return {valid:errors.length===0,errors};
}

export function isFreshClassification(
  row:InstrumentClassification,
  maxAgeDays=45,
){
  if(!row.effectiveDate) return false;
  const age=Date.now()-new Date(row.effectiveDate).getTime();
  return age>=0 && age<=maxAgeDays*86400000;
}
