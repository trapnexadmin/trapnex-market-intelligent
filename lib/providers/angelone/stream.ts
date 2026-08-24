import { ANGEL_ONE_WS, EXCHANGE_TYPE, WS_MODE } from "./constants";
import { getAngelSession } from "./auth";
import type { AngelStreamTick } from "./types";

type Listener = (tick: AngelStreamTick) => void;

type Subscription = {
  exchangeType: number;
  tokens: string[];
};

declare global {
  // eslint-disable-next-line no-var
  var __trapnexAngelStream: AngelStreamManager | undefined;
}

export class AngelStreamManager {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private subscriptions = new Map<string, Subscription>();
  private heartbeat: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connected = false;
  private connecting = false;

  async start() {
    if (this.connected || this.connecting) return;
    this.connecting = true;

    try {
      const session = await getAngelSession();
      const url = `${ANGEL_ONE_WS}?clientCode=${encodeURIComponent(process.env.ANGEL_ONE_CLIENT_CODE || "")}&feedToken=${encodeURIComponent(session.feedToken)}&apiKey=${encodeURIComponent(process.env.ANGEL_ONE_API_KEY || "")}`;

      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.connected = true;
        this.connecting = false;
        this.startHeartbeat();
        for (const subscription of this.subscriptions.values()) {
          this.sendSubscribe(subscription);
        }
      };

      this.ws.onmessage = async (event) => {
        if (typeof event.data === "string") {
          if (event.data === "pong") return;
          return;
        }

        const buffer = event.data instanceof ArrayBuffer
          ? event.data
          : event.data instanceof Blob
            ? await event.data.arrayBuffer()
            : null;

        if (!buffer) return;

        const tick = decodeAngelTick(buffer);
        if (tick) this.listeners.forEach((listener) => listener(tick));
      };

      this.ws.onerror = () => {
        this.connected = false;
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.connecting = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
      };
    } catch {
      this.connected = false;
      this.connecting = false;
      this.scheduleReconnect();
      throw new Error("Unable to start Angel One WebSocket");
    }
  }

  async stop() {
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.ws?.close();
    this.ws = null;
    this.connected = false;
    this.connecting = false;
  }

  subscribe(exchange: keyof typeof EXCHANGE_TYPE, tokens: string[], mode: number = WS_MODE.LTP) {
    const exchangeType = EXCHANGE_TYPE[exchange];
    if (!exchangeType || !tokens.length) return;

    const key = `${exchangeType}:${mode}`;
    this.subscriptions.set(key, { exchangeType, tokens: [...new Set(tokens)] });

    if (this.connected) {
      this.sendSubscribe(this.subscriptions.get(key)!);
    }
  }

  unsubscribe(exchange: keyof typeof EXCHANGE_TYPE, tokens: string[], mode: number = WS_MODE.LTP) {
    const exchangeType = EXCHANGE_TYPE[exchange];
    if (!exchangeType || !this.connected || !this.ws) return;

    this.ws.send(JSON.stringify({
      correlationID: `trapnex-${Date.now()}`,
      action: 0,
      params: {
        mode,
        tokenList: [{ exchangeType, tokens }],
      },
    }));
  }

  addListener(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  status() {
    return {
      connected: this.connected,
      connecting: this.connecting,
      subscriptions: [...this.subscriptions.values()],
    };
  }

  private sendSubscribe(subscription: Subscription) {
    this.ws?.send(JSON.stringify({
      correlationID: `trapnex-${Date.now()}`,
      action: 1,
      params: {
        mode: WS_MODE.LTP,
        tokenList: [subscription],
      },
    }));
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeat = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) this.ws.send("ping");
    }, 25_000);
  }

  private stopHeartbeat() {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.heartbeat = null;
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try { await this.start(); } catch {}
    }, 5_000);
  }
}

export function getAngelStreamManager() {
  globalThis.__trapnexAngelStream ??= new AngelStreamManager();
  return globalThis.__trapnexAngelStream;
}

/**
 * SmartAPI WebSocket V2 binary LTP packet.
 * The decoder intentionally keeps the normalized fields needed by Trapnex.
 * Unknown bytes remain available in raw for future Quote/SnapQuote expansion.
 */
export function decodeAngelTick(input: ArrayBuffer): AngelStreamTick | null {
  const bytes = new Uint8Array(input);
  if (bytes.length < 51) return null;

  const view = new DataView(input);
  const mode = bytes[0];
  const exchangeType = bytes[1];

  const tokenBytes = bytes.slice(2, 27);
  const zero = tokenBytes.indexOf(0);
  const token = new TextDecoder().decode(zero >= 0 ? tokenBytes.slice(0, zero) : tokenBytes);

  const scale = 100;
  const readI64 = (offset: number) => {
    try {
      const value = view.getBigInt64(offset, true);
      return Number(value) / scale;
    } catch {
      return undefined;
    }
  };

  const sequenceNumber = Number(view.getBigInt64(27, true));
  const exchangeTimestamp = Number(view.getBigInt64(35, true));
  const lastTradedPrice = readI64(43);

  return {
    mode,
    exchangeType,
    token,
    sequenceNumber: Number.isFinite(sequenceNumber) ? sequenceNumber : undefined,
    exchangeTimestamp: Number.isFinite(exchangeTimestamp) ? exchangeTimestamp : undefined,
    lastTradedPrice,
    raw: input,
  };
}
