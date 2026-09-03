"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { LIDOM_STATUSES, LIDOM_TEAMS, findTeam, santoDomingoDate } from "@/lib/sports/lidom";

function emptyGame() {
  const home = LIDOM_TEAMS[0];
  return {
    id: "",
    date: santoDomingoDate(),
    homeTeam: home.name,
    awayTeam: LIDOM_TEAMS[1].name,
    homeScore: 0,
    awayScore: 0,
    stadium: home.stadium,
    status: "final",
    featured: false,
  };
}

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
  const [form, setForm] = useState(emptyGame);
  const [results, setResults] = useState([]);
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

  async function reload() {
    const [games, table, player] = await Promise.all([
      fetch("/api/lidom/results").then(readJson),
      fetch("/api/lidom/standings").then(readJson),
      fetch("/api/lidom/spotlight").then(readJson),
    ]);
    setResults(games.results || []);
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
    reload().catch((err) => {
      setError(err instanceof Error ? err.message : "No se pudo cargar LIDOM.");
    });
  }, []);

  function setHome(homeTeam) {
    const team = findTeam(homeTeam);
    setForm((current) => ({
      ...current,
      homeTeam,
      stadium: team.stadium || current.stadium,
    }));
  }

  async function submitGame(event) {
    event.preventDefault();
    setSaving("game");
    setError("");
    setNotice("");

    try {
      const payload = {
        date: form.date,
        homeTeam: form.homeTeam,
        awayTeam: form.awayTeam,
        homeScore: Number(form.homeScore),
        awayScore: Number(form.awayScore),
        stadium: form.stadium,
        status: form.status,
        featured: Boolean(form.featured),
      };
      const response = await fetch(
        form.id ? `/api/lidom/results/${form.id}` : "/api/lidom/results",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      await readJson(response);
      setForm(emptyGame());
      setNotice(form.id ? "Partido actualizado." : "Partido publicado.");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el partido.");
    } finally {
      setSaving("");
    }
  }

  async function removeGame(id) {
    if (!window.confirm("¿Eliminar este partido?")) return;
    setSaving("game");
    setError("");
    try {
      await readJson(
        await fetch(`/api/lidom/results/${id}`, { method: "DELETE" }),
      );
      if (form.id === id) setForm(emptyGame());
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setSaving("");
    }
  }

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
      await reload();
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
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el spotlight.");
    } finally {
      setSaving("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-edge bg-surface p-6">
        <h2 className="font-heading text-lg font-semibold text-heading">
          Resultados y calendario LIDOM
        </h2>
        <p className="mt-1 text-sm text-muted">
          LIDOM no tiene API pública. Publica resultados de ayer, juegos de hoy y
          el calendario de mañana a mano.
        </p>

        <form onSubmit={submitGame} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Visitante
            <select
              value={form.awayTeam}
              onChange={(event) =>
                setForm((current) => ({ ...current, awayTeam: event.target.value }))
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
            Local
            <select
              value={form.homeTeam}
              onChange={(event) => setHome(event.target.value)}
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
            Carreras visitante
            <input
              type="number"
              min="0"
              max="99"
              value={form.awayScore}
              onChange={(event) =>
                setForm((current) => ({ ...current, awayScore: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Carreras local
            <input
              type="number"
              min="0"
              max="99"
              value={form.homeScore}
              onChange={(event) =>
                setForm((current) => ({ ...current, homeScore: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Fecha
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Estado
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            >
              {LIDOM_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            Estadio
            <input
              value={form.stadium}
              onChange={(event) =>
                setForm((current) => ({ ...current, stadium: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(event) =>
                setForm((current) => ({ ...current, featured: event.target.checked }))
              }
            />
            Juego del día
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button type="submit" variant="primary" disabled={saving === "game"}>
              {form.id ? "Actualizar partido" : "Publicar partido"}
            </Button>
            {form.id ? (
              <Button type="button" variant="outline" onClick={() => setForm(emptyGame())}>
                Cancelar edición
              </Button>
            ) : null}
          </div>
        </form>

        {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
        {notice ? <p className="mt-3 text-sm text-primary">{notice}</p> : null}

        <ul className="mt-6 space-y-3">
          {results.map((game) => (
            <li
              key={game.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-edge px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-heading">
                  {findTeam(game.awayTeam).emoji} {findTeam(game.awayTeam).short}{" "}
                  {game.awayScore} @ {findTeam(game.homeTeam).emoji}{" "}
                  {findTeam(game.homeTeam).short} {game.homeScore}
                  {game.featured ? " · Juego del día" : ""}
                  {game.status === "live" ? " · LIVE" : ""}
                </p>
                <p className="text-xs text-muted">
                  {String(game.date).slice(0, 10)} · {game.stadium || "LIDOM"} · {game.status}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-primary"
                  onClick={() =>
                    setForm({
                      id: game.id,
                      date: String(game.date).slice(0, 10),
                      homeTeam: game.homeTeam,
                      awayTeam: game.awayTeam,
                      homeScore: game.homeScore,
                      awayScore: game.awayScore,
                      stadium: game.stadium || findTeam(game.homeTeam).stadium,
                      status: game.status,
                      featured: Boolean(game.featured),
                    })
                  }
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-accent"
                  onClick={() => removeGame(game.id)}
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

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
