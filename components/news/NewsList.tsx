"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  headline: string;
  summary?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  newsScore?: number | null;
  riskScore?: number | null;
};

export default function NewsList({ symbol }: { symbol: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [status, setStatus] = useState("LOADING");

  useEffect(() => {
    let active = true;

    fetch(`/api/news?symbol=${encodeURIComponent(symbol)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        setEvents(data.events ?? []);
        setStatus(data.status ?? "UNAVAILABLE");
      })
      .catch(() => {
        if (active) setStatus("UNAVAILABLE");
      });

    return () => {
      active = false;
    };
  }, [symbol]);

  return (
    <section className="page-card">
      <div className="section-title">
        <h2>News Intelligence</h2>
        <span>{status}</span>
      </div>

      {events.map((event) => (
        <article key={event.id} className="news-item">
          <div>
            <b>{event.headline}</b>
            <p>{event.summary ?? "No summary supplied."}</p>
          </div>
          <aside>
            <small>News {event.newsScore ?? "—"}</small>
            <small>Risk {event.riskScore ?? "—"}</small>
            {event.url ? (
              <a href={event.url} target="_blank" rel="noreferrer">
                Source ↗
              </a>
            ) : null}
          </aside>
        </article>
      ))}
    </section>
  );
}
