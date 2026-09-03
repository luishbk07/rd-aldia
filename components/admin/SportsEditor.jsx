"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { LIDOM_TEAMS, findTeam, santoDomingoDate } from "@/lib/sports/lidom";
import LIDOMResultsEditor from "./LIDOMResultsEditor";

function emptyStandings() {
  return LIDOM_TEAMS.map((team) => ({
    team: team.name,
    wins: 0,
    losses: 0,
  }));
}

async function readJson(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error de red.");
  return data;
}

export default function SportsEditor() {
  const [standings, setStandings] = useState(emptyStandings);
  const [spotlight, setSpotlight] = useState({
    playerName: "",
    team: LIDOM_TEAMS[0].name,
    note: "",
    weekOf: santoDomingoDate(),
  });
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function reloadMeta() {
    const [table, player] = await Promise.all([
      fetch("/api/lidom/standings").then(readJson),
      fetch("/api/lidom/spotlight").then(readJson),
    ]);
    setStandings(
      (table.standings || emptyStandings()).map((row) => ({
        team: row.team,
        wins: row.wins,
        losses: row.losses,
      })),
    );
    if (player.spotlight) {
      setSpotlight({
        playerName: player.spotlight.playerName || "",
        team: player.spotlight.team || LIDOM_TEAMS[0].name,
        note: player.spotlight.note || "",
        weekOf: player.spotlight.weekOf || santoDomingoDate(),
      });
    }
  }

  useEffect(() => {
    reloadMeta().catch((err) => {
      setError(err instanceof Error ? err.message : "No se pudo cargar LIDOM.");
    });
  }, []);

  async function submitStandings(event) {
    event.preventDefault();
    setSaving("standings");
    setError("");
    setNotice("");
    try {
      await readJson(
        await fetch("/api/lidom/standings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teams: standings.map((row) => ({
              team: row.team,
              wins: Number(row.wins),
              losses: Number(row.losses),
            })),
          }),
        }),
      );
      setNotice("Tabla de posiciones actualizada.");
      await reloadMeta();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar posiciones.");
    } finally {
      setSaving("");
    }
  }

  async function submitSpotlight(event) {
    event.preventDefault();
    setSaving("spotlight");
    setError("");
    setNotice("");
    try {
      await readJson(
        await fetch("/api/lidom/spotlight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(spotlight),
        }),
      );
      setNotice("Jugador de la semana publicado.");
      await reloadMeta();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el spotlight.");
    } finally {
      setSaving("");
    }
  }

  return (
    <div className="space-y-6">
      <LIDOMResultsEditor />

      {error ? <p className="text-sm text-accent">{error}</p> : null}
      {notice ? <p className="text-sm text-primary">{notice}</p> : null}

      <section className="rounded-xl border border-edge bg-surface p-6">
        <h2 className="font-heading text-lg font-semibold text-heading">
          Tabla de posiciones
        </h2>
        <p className="mt-1 text-sm text-muted">
          PCT y juegos de ventaja se calculan al guardar.
        </p>
        <form onSubmit={submitStandings} className="mt-5 space-y-3">
          {standings.map((row, index) => {
            const team = findTeam(row.team);
            return (
              <div key={row.team} className="grid grid-cols-[1fr_5rem_5rem] items-center gap-2">
                <p className="text-sm font-medium text-heading">
                  {team.emoji} {team.short}
                </p>
                <input
                  type="number"
                  min="0"
                  max="80"
                  aria-label={`Ganados ${team.short}`}
                  value={row.wins}
                  onChange={(event) =>
                    setStandings((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, wins: event.target.value } : item,
                      ),
                    )
                  }
                  className="h-11 rounded-md border border-edge bg-background px-3"
                />
                <input
                  type="number"
                  min="0"
                  max="80"
                  aria-label={`Perdidos ${team.short}`}
                  value={row.losses}
                  onChange={(event) =>
                    setStandings((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, losses: event.target.value } : item,
                      ),
                    )
                  }
                  className="h-11 rounded-md border border-edge bg-background px-3"
                />
              </div>
            );
          })}
          <Button type="submit" variant="primary" disabled={saving === "standings"}>
            Guardar posiciones
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-edge bg-surface p-6">
        <h2 className="font-heading text-lg font-semibold text-heading">
          Jugador de la semana
        </h2>
        <form onSubmit={submitSpotlight} className="mt-5 grid gap-3">
          <label className="text-sm">
            Nombre
            <input
              required
              value={spotlight.playerName}
              onChange={(event) =>
                setSpotlight((current) => ({ ...current, playerName: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Equipo
            <select
              value={spotlight.team}
              onChange={(event) =>
                setSpotlight((current) => ({ ...current, team: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            >
              {LIDOM_TEAMS.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.emoji} {team.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Semana de
            <input
              type="date"
              value={spotlight.weekOf}
              onChange={(event) =>
                setSpotlight((current) => ({ ...current, weekOf: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Nota
            <textarea
              required
              minLength={8}
              rows={3}
              value={spotlight.note}
              onChange={(event) =>
                setSpotlight((current) => ({ ...current, note: event.target.value }))
              }
              className="mt-1 w-full rounded-md border border-edge bg-background px-3 py-2"
            />
          </label>
          <div>
            <Button type="submit" variant="primary" disabled={saving === "spotlight"}>
              Publicar spotlight
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
