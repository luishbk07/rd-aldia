"use client";

import { useEffect, useState } from "react";
import { findTeam, whatsAppShareUrl } from "@/lib/sports/lidom";
import DataStatusBadge from "./DataStatusBadge";
import LIDOMResults from "./LIDOMResults";
import LIDOMStandings from "./LIDOMStandings";
import LIDOMSchedule from "./LIDOMSchedule";
import MLBDominicans from "./MLBDominicans";
import MLBScores from "./MLBScores";
import MLBStandings from "./MLBStandings";

const LEAGUES = [
  { id: "mlb", label: "MLB" },
  { id: "lidom", label: "LIDOM" },
];

const MLB_TABS = [
  { id: "scores", label: "Marcador" },
  { id: "standings", label: "Posiciones" },
  { id: "stars", label: "Estrellas 🇩🇴" },
];

const LIDOM_TABS = [
  { id: "results", label: "Resultados" },
  { id: "schedule", label: "Calendario" },
  { id: "standings", label: "Posiciones" },
];

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#1e4d2b] p-5">
      <div className="h-4 w-40 animate-pulse rounded bg-white/15" />
      <div className="mt-3 h-8 w-64 animate-pulse rounded bg-white/20" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl bg-[#10281c]" />
        ))}
      </div>
    </div>
  );
}

function Retry({ message, onRetry }) {
  return (
    <div className="rounded-2xl bg-[#1e4d2b] p-6 text-white">
      <p className="font-heading font-semibold">Deportes</p>
      <p className="mt-2 text-sm text-red-200">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#1e4d2b]"
      >
        Reintentar
      </button>
    </div>
  );
}

function featuredMlbGame(mlb) {
  const pool = [...(mlb?.scores?.today || []), ...(mlb?.scores?.yesterday || [])];
  return pool.find((game) => game.status === "live") || pool.find((game) => game.status === "final") || null;
}

export default function SportsSection({ variant = "full" }) {
  const [league, setLeague] = useState("mlb");
  const [mlbTab, setMlbTab] = useState("scores");
  const [lidomTab, setLidomTab] = useState("results");
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetch("/api/sports", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo cargar deportes.");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setState({ status: "ready", data });
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
  }, [tick]);

  function retry() {
    setTick((current) => current + 1);
  }

  if (state.status === "loading") {
    return variant === "teaser" ? (
      <div className="h-40 animate-pulse rounded-xl bg-[#1e4d2b]" />
    ) : (
      <Skeleton />
    );
  }

  if (state.status === "error") {
    if (variant === "teaser") {
      return (
        <a href="/lidom-resultados" className="block rounded-xl bg-[#1e4d2b] p-6 text-white shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e2c08d]">Deportes</p>
          <p className="mt-3 font-heading text-xl font-semibold">LIDOM + MLB 🇩🇴</p>
          <p className="mt-1 text-sm text-red-200">No se pudo cargar el marcador.</p>
        </a>
      );
    }
    return <Retry message={state.message} onRetry={retry} />;
  }

  const { lidom, mlb } = state.data;
  const mlbGame = featuredMlbGame(mlb);
  const lidomGame = lidom.gameOfTheDay;
  const lidomTeams = lidomGame
    ? { away: findTeam(lidomGame.awayTeam), home: findTeam(lidomGame.homeTeam) }
    : null;

  if (variant === "teaser") {
    return (
      <a href="/lidom-resultados" className="block rounded-xl bg-[#1e4d2b] p-6 text-white shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e2c08d]">Deportes</p>
        {mlbGame ? (
          <>
            <p className="mt-3 font-heading text-xl font-semibold">
              {mlbGame.awayAbbr} {mlbGame.awayScore ?? "—"} @ {mlbGame.homeAbbr}{" "}
              {mlbGame.homeScore ?? "—"}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {mlbGame.status === "live" ? `MLB en vivo · ${mlbGame.inning}` : "Grandes Ligas"}
            </p>
          </>
        ) : lidomGame ? (
          <>
            <p className="mt-3 font-heading text-xl font-semibold">
              {lidomTeams.away.emoji} {lidomTeams.away.short}{" "}
              {lidomGame.status === "scheduled" ? "" : lidomGame.awayScore} @{" "}
              {lidomTeams.home.emoji} {lidomTeams.home.short}{" "}
              {lidomGame.status === "scheduled" ? "" : lidomGame.homeScore}
            </p>
            <p className="mt-1 text-sm text-white/70">LIDOM</p>
          </>
        ) : (
          <p className="mt-3 font-heading text-xl font-semibold">LIDOM + MLB 🇩🇴</p>
        )}
        <div className="mt-3">
          <DataStatusBadge
            source={mlbGame?.status === "live" ? "live" : "cached"}
            updatedAt={state.data.updatedAt}
            tone="dark"
            clock="time"
          />
        </div>
      </a>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-[#1e4d2b] text-white shadow-card">
      <div className="border-b border-[#8b5a2b] bg-[#8b5a2b]/80 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f3e6c8]">
          Béisbol
        </p>
        <h2 className="mt-1 font-heading text-2xl font-semibold">LIDOM y Grandes Ligas</h2>
        <div className="mt-2">
          <DataStatusBadge
            source={league === "mlb" ? "live" : "cached"}
            updatedAt={state.data.updatedAt}
            tone="dark"
            clock={league === "mlb" ? "time" : "auto"}
          />
        </div>
        <p className="mt-1 text-sm text-white/80">
          Resultados en vivo de las Grandes Ligas y la Liga Dominicana. Sigue a
          tus equipos y peloteros favoritos.
        </p>
      </div>

      <div className="flex gap-2 px-5 pt-4">
        {LEAGUES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLeague(item.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              league === item.id ? "bg-white text-[#1e4d2b]" : "bg-black/20 text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {league === "mlb" ? (
        <>
          {mlbGame?.status === "live" ? (
            <div className="mt-4 border-b border-white/10 px-5 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e2c08d]">
                En vivo
              </p>
              <p className="mt-1 font-heading text-xl">
                {mlbGame.awayAbbr} {mlbGame.awayScore} @ {mlbGame.homeAbbr} {mlbGame.homeScore}
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">
                  LIVE {mlbGame.inning}
                </span>
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 px-5 pt-4">
            {MLB_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMlbTab(item.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  mlbTab === item.id ? "bg-white/90 text-[#1e4d2b]" : "bg-black/20 text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {mlbTab === "scores" ? (
              <MLBScores
                today={mlb.scores?.today}
                yesterday={mlb.scores?.yesterday}
                error={mlb.scores?.error}
              />
            ) : null}
            {mlbTab === "standings" ? (
              <MLBStandings divisions={mlb.standings?.divisions} error={mlb.standings?.error} />
            ) : null}
            {mlbTab === "stars" ? (
              <MLBDominicans players={mlb.stars?.players || mlb.players} error={mlb.stars?.error} />
            ) : null}
          </div>
        </>
      ) : (
        <>
          {lidomGame ? (
            <div className="mt-4 border-b border-white/10 px-5 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e2c08d]">
                Juego del día
              </p>
              <p className="mt-2 font-heading text-2xl">
                {lidomTeams.away.emoji} {lidomTeams.away.short}{" "}
                {lidomGame.status === "scheduled" ? "" : lidomGame.awayScore} @{" "}
                {lidomTeams.home.emoji} {lidomTeams.home.short}{" "}
                {lidomGame.status === "scheduled" ? "" : lidomGame.homeScore}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {lidomGame.status === "live" ? (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">LIVE</span>
                ) : null}
                <a
                  href={whatsAppShareUrl(lidomGame)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[#e2c08d] underline-offset-2 hover:underline"
                >
                  Compartir en WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <p className="mt-4 px-5 text-sm text-white/70">
              {lidom.inSeason
                ? "Los resultados de LIDOM se publican cuando hay jornada."
                : "LIDOM vuelve en octubre. Mientras, sigue a los dominicanos en MLB."}
            </p>
          )}

          {lidom.spotlight ? (
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e2c08d]">
                Jugador de la semana
              </p>
              <p className="mt-1 font-heading text-lg">
                🇩🇴 {lidom.spotlight.playerName} · {findTeam(lidom.spotlight.team).short}
              </p>
              <p className="mt-1 text-sm text-white/75">{lidom.spotlight.note}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 px-5 pt-4">
            {LIDOM_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLidomTab(item.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  lidomTab === item.id ? "bg-white/90 text-[#1e4d2b]" : "bg-black/20 text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {lidomTab === "results" ? (
              <LIDOMResults
                yesterday={lidom.yesterday}
                today={lidom.today}
                recent={lidom.recent}
              />
            ) : null}
            {lidomTab === "schedule" ? (
              <LIDOMSchedule today={lidom.today} tomorrow={lidom.tomorrow} />
            ) : null}
            {lidomTab === "standings" ? <LIDOMStandings standings={lidom.standings} /> : null}
          </div>
        </>
      )}
    </section>
  );
}
