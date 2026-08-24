import { generate } from 'otplib';
import type { MarketSnapshot } from '@/lib/intelligence/types';
import type { MarketDataProvider, ProviderHealth } from './provider';

const API = 'https://apiconnect.angelone.in';

export class AngelOneProvider implements MarketDataProvider {
  readonly name = 'Angel One SmartAPI';
  private token: string | null = null;
  private tokenAt = 0;

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    const required = ['ANGEL_ONE_API_KEY', 'ANGEL_ONE_CLIENT_CODE', 'ANGEL_ONE_PASSWORD', 'ANGEL_ONE_TOTP'];
    const missing = required.filter((key) => !process.env[key] && !(key === 'ANGEL_ONE_PASSWORD' ? process.env.ANGEL_ONE_PIN : key === 'ANGEL_ONE_TOTP' ? process.env.ANGEL_ONE_TOTP_SECRET : false));
    if (missing.length) return { provider: this.name, status: 'NOT_CONFIGURED', message: `Missing: ${missing.join(', ')}`, checkedAt };
    const started = Date.now();
    try {
      await this.login();
      return { provider: this.name, status: 'READY', latencyMs: Date.now() - started, checkedAt };
    } catch (error) {
      return { provider: this.name, status: 'ERROR', latencyMs: Date.now() - started, message: error instanceof Error ? error.message : 'Authentication failed', checkedAt };
    }
  }

  private headers(authorization?: string) {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': process.env.ANGEL_ONE_CLIENT_LOCAL_IP || '127.0.0.1',
      'X-ClientPublicIP': process.env.ANGEL_ONE_CLIENT_PUBLIC_IP || '',
      'X-MACAddress': process.env.ANGEL_ONE_MAC_ADDRESS || '00:00:00:00:00:00',
      'X-PrivateKey': process.env.ANGEL_ONE_API_KEY || '',
      ...(authorization ? { Authorization: `Bearer ${authorization}` } : {}),
    };
  }

  private async login() {
    if (this.token && Date.now() - this.tokenAt < 30 * 60 * 1000) return this.token;
    const otpSecret = process.env.ANGEL_ONE_TOTP || process.env.ANGEL_ONE_TOTP_SECRET;
    const password = process.env.ANGEL_ONE_PASSWORD || process.env.ANGEL_ONE_PIN;
    if (!otpSecret || !password) {
      throw new Error('Missing Angel One authentication environment variables.');
    }
    const totp = await generate({ secret: otpSecret });
    const response = await fetch(`${API}/rest/auth/angelbroking/user/v1/loginByPassword`, {
      method: 'POST', headers: this.headers(),
      body: JSON.stringify({ clientcode: process.env.ANGEL_ONE_CLIENT_CODE, password, totp, state: process.env.ANGEL_ONE_STATE || 'live' }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.status || !payload?.data?.jwtToken) throw new Error(payload?.message || `Angel One login ${response.status}`);
    this.token = payload.data.jwtToken;
    this.tokenAt = Date.now();
    return this.token;
  }

  async getSnapshots(): Promise<MarketSnapshot[]> {
    await this.login();
    return [];
  }
}
