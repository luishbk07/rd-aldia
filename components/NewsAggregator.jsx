"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataStatusBadge from "./DataStatusBadge";
import { NEWS_SOURCES, NEWS_TABS } from "@/lib/news/sources";

const SOURCE_META = Object.fromEntries(
  NEWS_SOURCES.map((source) => [source.id, source]),
);

function timeAgo(iso) {
  if (!iso) return "Fecha no disponible";
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "Hace un momento";

  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) {
    return minutes === 1 ? "Hace 1 minuto" : `Hace ${minutes} minutos`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "Hace 1 hora" : `Hace ${hours} horas`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) return "Hace 1 día";
  if (days < 7) return `Hace ${days} días`;

  return new Date(iso).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "short",
  });
}

function Skeleton({ rows = 8 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-surface shadow-card">
      <div className="h-1 bg-accent" />
      <div className="p-5 sm:p-6">
        <div className="h-3 w-24 animate-pulse rounded bg-edge" />
        <div className="mt-3 h-7 w-40 animate-pulse rounded bg-edge" />
        <div className="mt-5 flex gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-8 w-20 animate-pulse rounded-full bg-edge" />
          ))}
        </div>
        <div className="mt-6 divide-y divide-edge">
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="py-4">
              <div className="h-3 w-36 animate-pulse rounded bg-edge" />
              <div className="mt-2 h-5 w-full animate-pulse rounded bg-edge" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Retry({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-accent/30 bg-surface p-6">
      <p className="font-heading font-semibold text-heading">Noticias</p>
      <p className="mt-2 text-sm text-accent">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary"
      >
        Reintentar
      </button>
    </div>
  );
}

export default function NewsAggregator({
  limit = 12,
  showMoreLink = true,
  showHeading = true,
}) {
  const [tab, setTab] = useState("all");
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetch(`/api/news?limit=${limit}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar las noticias.");
        }
        return data;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Error de red.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [limit, tick]);

  const articles = state.data?.articles || [];
  const filtered = useMemo(() => {
    if (tab === "all") return articles;
    return articles.filter((article) => article.sourceId === tab);
  }, [articles, tab]);

  if (state.status === "loading") {
    return <Skeleton rows={Math.min(8, limit)} />;
  }

  if (state.status === "error") {
    return (
      <Retry
        message={state.message}
        onRetry={() => {
          setState({ status: "loading" });
          setTick((current) => current + 1);
        }}
      />
    );
  }

  const usesGoogle = (state.data.feeds || []).some(
    (feed) => feed.via === "google-news",
  );

  return (
    <section className="overflow-hidden rounded-xl border border-edge bg-surface shadow-card">
      <div className="h-1 bg-accent" aria-hidden="true" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {showHeading ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Prensa dominicana
              </p>
              <h2 className="mt-1 font-heading text-2xl font-semibold text-heading">
                Noticias
              </h2>
            </div>
          ) : (
            <p className="text-sm font-medium text-muted">Últimos titulares</p>
          )}
          <DataStatusBadge
            source="cached"
            updatedAt={state.data.updatedAt}
            clock="time"
          />
        </div>

        {showHeading ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Titulares de Listín Diario, El Caribe, Diario Libre y El Nacional.
            Abren en el medio original.
          </p>
        ) : null}

        <div
          className="mt-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrar por medio"
        >
          {NEWS_TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "bg-background text-heading ring-1 ring-edge hover:bg-accent/8"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            No hay titulares de este medio en la última carga.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-edge">
            {filtered.map((article) => {
              const meta = SOURCE_META[article.sourceId];
              return (
                <li key={article.id}>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex gap-3 py-4 sm:gap-4"
                  >
                    {article.image ? (
                      <img
                        src={article.image}
                        alt=""
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className="mt-0.5 size-12 shrink-0 rounded-md object-cover ring-1 ring-edge sm:size-16"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span
                        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md text-[0.65rem] font-bold text-white sm:size-10 sm:text-[0.7rem]"
                        style={{ backgroundColor: meta?.accent || "#c8102e" }}
                        aria-hidden="true"
                      >
                        {meta?.initials || "RD"}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                        <span style={{ color: meta?.accent }}>{article.source}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={article.publishedAt || undefined}>
                          {timeAgo(article.publishedAt)}
                        </time>
                      </span>
                      <span className="mt-1 block font-heading text-[1.05rem] font-semibold leading-snug text-heading group-hover:text-accent">
                        {article.title}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {usesGoogle ? (
          <p className="mt-4 text-xs leading-5 text-muted">
            Listín Diario y El Caribe ya no publican RSS propio; esos titulares
            se leen vía Google Noticias.
          </p>
        ) : null}

        {showMoreLink ? (
          <div className="mt-5 border-t border-edge pt-4">
            <Link
              href="/noticias"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Ver más noticias
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
