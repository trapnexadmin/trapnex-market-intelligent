export const ANGEL_ONE_API = "https://apiconnect.angelone.in";
export const ANGEL_ONE_INSTRUMENT_MASTER =
  "https://margincalculator.angelone.in/OpenAPI_File/files/OpenAPIScripMaster.json";
export const ANGEL_ONE_WS = "wss://smartapisocket.angelone.in/smart-stream";

export const EXCHANGE_TYPE: Record<string, number> = {
  NSE: 1,
  NFO: 2,
  BSE: 3,
  BFO: 4,
  MCX: 5,
  NCX: 7,
  CDE: 13,
};

export const WS_MODE = {
  LTP: 1,
  QUOTE: 2,
  SNAP_QUOTE: 3,
  DEPTH: 4,
} as const;
