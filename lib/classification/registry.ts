import type {InstrumentClassification} from "./types";
import { loadClassifications, saveClassifications } from "./persistence";

let current:InstrumentClassification[]=loadClassifications();

function syncPersisted() {
  current = loadClassifications();
}

export function replaceClassifications(rows:InstrumentClassification[]){
  current=rows.map((row) => ({...row}));
  saveClassifications(current);
}

export function listClassifications(){
  syncPersisted();
  return current;
}

export function getClassification(symbol:string){
  syncPersisted();
  return current.find(x=>x.symbol===symbol.toUpperCase())??null;
}

export function getCapSymbols(bucket:"LARGE"|"MID"|"SMALL"){
  syncPersisted();
  return current.filter(x=>x.capBucket===bucket).map(x=>x.symbol);
}

export function getSectorSymbols(sector:string){
  syncPersisted();
  const target=sector.toUpperCase();
  return current.filter(x=>x.sector?.toUpperCase()===target).map(x=>x.symbol);
}
