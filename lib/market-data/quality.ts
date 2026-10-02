import type { MarketQuote } from "@/lib/domain/market";
import type { QuoteQualityResult } from "./types";
const finite=(v:number|null|undefined)=>v===null||v===undefined||Number.isFinite(v);
export function validateQuotes(quotes:MarketQuote[]):QuoteQualityResult{
 const accepted:MarketQuote[]=[]; const rejected:{symbol:string;reason:string}[]=[];
 for(const quote of quotes){const symbol=quote.symbol.trim().toUpperCase();
  if(!symbol){rejected.push({symbol:"UNKNOWN",reason:"SYMBOL_MISSING"});continue;}
  if(quote.price===null||!Number.isFinite(quote.price)||quote.price<=0){rejected.push({symbol,reason:"PRICE_INVALID"});continue;}
  if(!finite(quote.previousClose)||!finite(quote.open)||!finite(quote.high)||!finite(quote.low)||!finite(quote.volume)){rejected.push({symbol,reason:"NUMERIC_FIELD_INVALID"});continue;}
  if(quote.high!==null&&quote.high<quote.price){rejected.push({symbol,reason:"HIGH_BELOW_PRICE"});continue;}
  if(quote.low!==null&&quote.low>quote.price){rejected.push({symbol,reason:"LOW_ABOVE_PRICE"});continue;}
  if(!Number.isFinite(new Date(quote.timestamp).getTime())){rejected.push({symbol,reason:"TIMESTAMP_INVALID"});continue;}
  accepted.push({...quote,symbol});
 }
 return {accepted,rejected};
}
