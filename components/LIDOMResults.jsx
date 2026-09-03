"use client";

import { findTeam, whatsAppShareUrl } from "@/lib/sports/lidom";

function Score({ game }) {
  const away = findTeam(game.awayTeam);
  const home = findTeam(game.homeTeam);
  const live = game.status === "live";

  return (
    <article className="rounded-xl border border-white/10 bg-[#10281c] p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs uppercase tracking-[0.14em] text-white/60">
        <span>{game.stadium || "LIDOM"}</span>
        {live ? (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[0.65rem] font-bold text-white">
            LIVE
          </span>
        ) : (
          <span>{game.status === "final" ? "Final" : "Programado"}</span>
        )}
      </div>
      <div className="space-y-2">
        <p className="flex items-center justify-between font-heading text-lg">
          <span>
            {away.emoji} {away.short}
          </span>
          <span>{game.status === "scheduled" ? "—" : game.awayScore}</span>
        </p>
        <p className="flex items-center justify-between font-heading text-lg">
          <span>
            {home.emoji} {home.short}
          </span>
          <span>{game.status === "scheduled" ? "—" : game.homeScore}</span>
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-white/55">{game.date}</p>
        <a
          href={whatsAppShareUrl(game)}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-[#e2c08d] underline-offset-2 hover:underline"
        >
          WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function LIDOMResults({ yesterday = [], today = [], recent = [] }) {
  const games = [...today.filter((game) => game.status === "live"), ...yesterday, ...recent].filter(
    (game, index, list) => list.findIndex((item) => item.id === game.id) === index,
  );

  if (!games.length) {
    return (
      <p className="text-sm text-white/70">
        No hay resultados cargados. En temporada (oct–ene) aparecen aquí los de ayer y los en vivo.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {games.slice(0, 6).map((game) => (
        <Score key={game.id} game={game} />
      ))}
    </div>
  );
}
