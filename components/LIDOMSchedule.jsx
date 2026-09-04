"use client";

import { findTeam } from "@/lib/sports/lidom";

export default function LIDOMSchedule({ today = [], tomorrow = [] }) {
  const blocks = [
    { label: "Hoy", games: today },
    { label: "Mañana", games: tomorrow },
  ];

  if (!today.length && !tomorrow.length) {
    return (
      <p className="text-sm text-white/70">
        No hay partidos programados para hoy o mañana.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {blocks.map((block) => (
        <div key={block.label}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e2c08d]">
            {block.label}
          </h3>
          {block.games.length ? (
            <ul className="space-y-2">
              {block.games.map((game) => {
                const away = findTeam(game.awayTeam);
                const home = findTeam(game.homeTeam);
                return (
                  <li
                    key={game.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/20 px-4 py-3 text-white"
                  >
                    <span>
                      {away.emoji} {away.short} @ {home.emoji} {home.short}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-white/60">
                      {game.status === "live" ? "En vivo" : game.stadium}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-white/55">Sin juegos.</p>
          )}
        </div>
      ))}
    </div>
  );
}
