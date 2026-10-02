use client";

import { useEffect, useMemo, useState } from "react";

type Holding = {
  id?: string;
  portfolioKey: string;
  symbol: string;
  exchange: "NSE" | "BSE";
  quantity: number;
  averagePrice: number;
  notes: string | null;
};

type Overview = {
  capital: number;
  riskProfile: string;
  actualValue: number;
  holdings: Holding[];
  comparison: Array<{
    symbol: string;
    exchange: string;
    quantity: number;
    averagePrice: number;
    currentValue: number;
    actualWeightPct: number;
    targetWeightPct: number;
    driftPct: number;
    modelIncluded: boolean;
  }>;
  modelOnly: Array<{
    symbol: string;
    targetWeightPct: number;
    targetAmount: number;
    sector: string | null;
    capBucket: string | null;
  }>;
};

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

export default function PortfolioPage() {
  const [capital, setCapital] = useState("1000000");
  const [riskProfile, setRiskProfile] = useState("BALANCED");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [status, setStatus] = useState("IDLE");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({
    symbol: "",
    exchange: "NSE" as "NSE" | "BSE",
    quantity: "",
    averagePrice: "",
    notes: "",
  });

  const query = useMemo(
    () =>
      `portfolioKey=default&capital=${encodeURIComponent(
        capital,
      )}&riskProfile=${riskProfile}`,
    [capital, riskProfile],
  );

  async function load() {
    setStatus("LOADING");
    setError("");

    try {
      const response = await fetch(`/api/portfolio/overview?${query}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "PORTFOLIO_OVERVIEW_ERROR");
      }

      setOverview(data);
      setStatus(data.status ?? "READY");
    } catch (error) {
      setOverview(null);
      setStatus("ERROR");
      setError(
        error instanceof Error
          ? error.message
          : "PORTFOLIO_OVERVIEW_ERROR",
      );
    }
  }

  async function saveHolding() {
    try {
      const response = await fetch("/api/portfolio/holdings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioKey: "default",
          symbol: draft.symbol,
          exchange: draft.exchange,
          quantity: Number(draft.quantity),
          averagePrice: Number(draft.averagePrice),
          notes: draft.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "SAVE_HOLDING_ERROR");
      }

      setDraft({
        symbol: "",
        exchange: "NSE",
        quantity: "",
        averagePrice: "",
        notes: "",
      });

      await load();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "SAVE_HOLDING_ERROR",
      );
    }
  }

  async function removeHolding(symbol: string, exchange: string) {
    const response = await fetch(
      `/api/portfolio/holdings?portfolioKey=default&symbol=${encodeURIComponent(
        symbol,
      )}&exchange=${encodeURIComponent(exchange)}`,
      { method: "DELETE" },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error ?? "DELETE_HOLDING_ERROR");
      return;
    }

    await load();
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="page-shell">
      <div className="intro">
        <div>
          <label>PORTFOLIO INTELLIGENCE</label>
          <h1>Portfolio Allocation</h1>
          <p>
            Manage holdings and compare your current book with the model
            allocation.
          </p>
        </div>
        <button className="open" onClick={() => void load()}>
          {status === "LOADING" ? "REFRESHING…" : "REFRESH"}
        </button>
      </div>

      <section className="panel" style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted">CAPITAL (INR)</span>
            <input
              value={capital}
              onChange={(event) => setCapital(event.target.value)}
              inputMode="numeric"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted">RISK PROFILE</span>
            <select
              value={riskProfile}
              onChange={(event) => setRiskProfile(event.target.value)}
            >
              <option>CONSERVATIVE</option>
              <option>BALANCED</option>
              <option>GROWTH</option>
            </select>
          </label>

          <button className="open" onClick={() => void load()}>
            REBUILD MODEL
          </button>
        </div>
      </section>

      {error && (
        <section className="panel" style={{ padding: 16, marginTop: 12 }}>
          {error}
        </section>
      )}

      {overview && (
        <>
          <section className="topgrid" style={{ marginTop: 12 }}>
            <article className="panel" style={{ padding: 16 }}>
              <div className="head">
                <span>ACTUAL BOOK</span>
                <b>{overview.holdings.length}</b>
              </div>
              <strong style={{ font: '800 30px "JetBrains Mono"' }}>
                {money(overview.actualValue)}
              </strong>
              <p className="muted">Recorded cost value</p>
            </article>

            <article className="panel" style={{ padding: 16 }}>
              <div className="head">
                <span>MODEL CAPITAL</span>
              </div>
              <strong style={{ font: '800 30px "JetBrains Mono"' }}>
                {money(overview.capital)}
              </strong>
              <p className="muted">{overview.riskProfile} profile</p>
            </article>
          </section>

          <section
            className="panel"
            style={{ marginTop: 12, padding: 16 }}
          >
            <div className="head">
              <span>ADD / UPDATE HOLDING</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(140px,1fr))",
                gap: 10,
              }}
            >
              <input
                placeholder="SYMBOL"
                value={draft.symbol}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    symbol: event.target.value.toUpperCase(),
                  })
                }
              />

              <select
                value={draft.exchange}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    exchange: event.target.value as "NSE" | "BSE",
                  })
                }
              >
                <option>NSE</option>
                <option>BSE</option>
              </select>

              <input
                placeholder="QUANTITY"
                inputMode="decimal"
                value={draft.quantity}
                onChange={(event) =>
                  setDraft({ ...draft, quantity: event.target.value })
                }
              />

              <input
                placeholder="AVG PRICE"
                inputMode="decimal"
                value={draft.averagePrice}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    averagePrice: event.target.value,
                  })
                }
              />

              <input
                placeholder="NOTES (OPTIONAL)"
                value={draft.notes}
                onChange={(event) =>
                  setDraft({ ...draft, notes: event.target.value })
                }
              />

              <button className="open" onClick={() => void saveHolding()}>
                SAVE HOLDING
              </button>
            </div>
          </section>

          <section className="panel" style={{ marginTop: 12 }}>
            <div className="head">
              <span>ACTUAL vs MODEL</span>
              <b>{overview.comparison.length}</b>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    {[
                      "Symbol",
                      "Actual",
                      "Target",
                      "Drift",
                      "Value",
                      "Status",
                      "Action",
                    ].map((header) => (
                      <th
                        key={header}
                        style={{
                          textAlign: "left",
                          padding: 10,
                          color: "#718097",
                          font: "8px JetBrains Mono",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {overview.comparison.map((row) => (
                    <tr
                      key={`${row.symbol}-${row.exchange}`}
                      style={{ borderTop: "1px solid #131d29" }}
                    >
                      <td style={{ padding: 10, fontWeight: 700 }}>
                        {row.symbol}
                      </td>
                      <td style={{ padding: 10 }}>
                        {row.actualWeightPct.toFixed(2)}%
                      </td>
                      <td style={{ padding: 10 }}>
                        {row.targetWeightPct.toFixed(2)}%
                      </td>
                      <td style={{ padding: 10 }}>
                        {row.driftPct.toFixed(2)}%
                      </td>
                      <td style={{ padding: 10 }}>
                        {money(row.currentValue)}
                      </td>
                      <td style={{ padding: 10 }}>
                        {row.modelIncluded
                          ? "IN MODEL"
                          : "OUTSIDE MODEL"}
                      </td>
                      <td style={{ padding: 10 }}>
                        <button
                          onClick={() =>
                            void removeHolding(
                              row.symbol,
                              row.exchange,
                            )
                          }
                        >
                          REMOVE
                        </button>
                      </td>
                    </tr>
                  ))}

                  {overview.comparison.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ padding: 16 }}
                        className="muted"
                      >
                        No holdings recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section
            className="panel"
            style={{ marginTop: 12, padding: 16 }}
          >
            <div className="head">
              <span>MODEL-ONLY WATCHLIST</span>
              <b>{overview.modelOnly.length}</b>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    {[
                      "Symbol",
                      "Target Weight",
                      "Target Amount",
                      "Cap",
                      "Sector",
                    ].map((header) => (
                      <th
                        key={header}
                        style={{
                          textAlign: "left",
                          padding: 10,
                          color: "#718097",
                          font: "8px JetBrains Mono",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {overview.modelOnly.map((row) => (
                    <tr
                      key={row.symbol}
                      style={{ borderTop: "1px solid #131d29" }}
                    >
                      <td style={{ padding: 10, fontWeight: 700 }}>
                        {row.symbol}
                      </td>
                      <td style={{ padding: 10 }}>
                        {row.targetWeightPct.toFixed(2)}%
                      </td>
                      <td style={{ padding: 10 }}>
                        {money(row.targetAmount)}
                      </td>
                      <td style={{ padding: 10 }}>
                        {row.capBucket ?? "—"}
                      </td>
                      <td style={{ padding: 10 }}>
                        {row.sector ?? "UNCLASSIFIED"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
