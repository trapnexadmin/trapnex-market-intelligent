import type {InstrumentClassification} from "./types";

let current:InstrumentClassification[]=[];

export function replaceClassifications(rows:InstrumentClassification[]){
  current=rows;
}

export function listClassifications(){
  return current;
}

export function getClassification(symbol:string){
  return current.find(x=>x.symbol===symbol.toUpperCase())??null;
}

export function getCapSymbols(bucket:"LARGE"|"MID"|"SMALL"){
  return current.filter(x=>x.capBucket===bucket).map(x=>x.symbol);
}

export function getSectorSymbols(sector:string){
  const target=sector.toUpperCase();
  return current.filter(x=>x.sector?.toUpperCase()===target).map(x=>x.symbol);
}
