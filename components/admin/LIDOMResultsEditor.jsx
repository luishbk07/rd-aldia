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

async function readJson(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error de red.");
  return data;
}

export default function LIDOMResultsEditor({ onChanged }) {
  const [form, setForm] = useState(emptyGame);
  const [results, setResults] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function reload() {
    const data = await readJson(await fetch("/api/lidom/results"));
    setResults(data.results || []);
    onChanged?.(data.results || []);
  }

  useEffect(() => {
    reload().catch((err) => {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los resultados.");
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
    setSaving(true);
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
      await readJson(
        await fetch(form.id ? `/api/lidom/results/${form.id}` : "/api/lidom/results", {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
      setForm(emptyGame());
      setNotice(form.id ? "Partido actualizado en lidom_results." : "Partido publicado en lidom_results.");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el partido.");
    } finally {
      setSaving(false);
    }
  }

  async function removeGame(id) {
    if (!window.confirm("¿Eliminar este partido?")) return;
    setSaving(true);
    setError("");
    try {
      await readJson(await fetch(`/api/lidom/results/${id}`, { method: "DELETE" }));
      if (form.id === id) setForm(emptyGame());
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-edge bg-surface p-6">
      <h2 className="font-heading text-lg font-semibold text-heading">
        Resultados LIDOM
      </h2>
      <p className="mt-1 text-sm text-muted">
        Fecha, equipos, marcador, estadio y estado.
      </p>

      <form onSubmit={submitGame} className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Fecha
          <input
            type="date"
            name="date"
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
            name="status"
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
        <label className="text-sm">
          Visitante
          <select
            name="away_team"
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
            name="home_team"
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
            name="away_score"
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
            name="home_score"
            min="0"
            max="99"
            value={form.homeScore}
            onChange={(event) =>
              setForm((current) => ({ ...current, homeScore: event.target.value }))
            }
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Estadio
          <input
            name="stadium"
            value={form.stadium}
            onChange={(event) =>
              setForm((current) => ({ ...current, stadium: event.target.value }))
            }
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {form.id ? "Actualizar partido" : "Guardar resultado"}
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

      <h3 className="mt-6 font-heading text-sm font-semibold text-heading">
        Resultados recientes ({results.length})
      </h3>
      <ul className="mt-3 space-y-3">
        {results.slice(0, 12).map((game) => (
          <li
            key={game.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-edge px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-heading">
                {findTeam(game.awayTeam).emoji} {findTeam(game.awayTeam).short}{" "}
                {game.awayScore} @ {findTeam(game.homeTeam).emoji}{" "}
                {findTeam(game.homeTeam).short} {game.homeScore}
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
  );
}
