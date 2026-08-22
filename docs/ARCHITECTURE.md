# Architecture
Retail-first UI, institutional-grade intelligence underneath.

Market data → normalization → quality/freshness → Market Pulse → cap pulse → sector pulse → stock score → news/risk confirmation → opportunities → portfolio allocation → alerts.

Providers: NSE/BSE, Angel One SmartAPI, Indian Stock Market API, Finnhub, Alpha Vantage, Apify fallback, news/RSS and Google AI Studio.

Supabase PostgreSQL is the default database. Keep database access behind a repository layer for Local, DigitalOcean and AWS PostgreSQL later.

Never expose API credentials in client code or NEXT_PUBLIC_* variables.
