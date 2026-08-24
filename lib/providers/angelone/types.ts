export interface AngelInstrument {
  token: string;
  symbol: string;
  name: string;
  expiry: string;
  strike: string;
  lotsize: string;
  instrumenttype: string;
  exch_seg: string;
  tick_size: string;
  is_fno?: boolean;
}

export interface AngelSession {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
  state?: string;
  createdAt: number;
}

export interface AngelLtpResponse {
  exchange: string;
  tradingsymbol: string;
  symboltoken: string;
  open: string;
  high: string;
  low: string;
  close: string;
  ltp: string;
}

export interface AngelStreamTick {
  mode: number;
  exchangeType: number;
  token: string;
  sequenceNumber?: number;
  exchangeTimestamp?: number;
  lastTradedPrice?: number;
  lastTradedQuantity?: number;
  averageTradedPrice?: number;
  volumeTradeForTheDay?: number;
  totalBuyQuantity?: number;
  totalSellQuantity?: number;
  openPriceOfTheDay?: number;
  highPriceOfTheDay?: number;
  lowPriceOfTheDay?: number;
  closedPrice?: number;
  openInterest?: number;
  upperCircuitLimit?: number;
  lowerCircuitLimit?: number;
  raw?: unknown;
}
