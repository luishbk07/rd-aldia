"use client";

function ScoreCard({ game }) {
  const live = game.status === "live";
  const showScore = game.status === "live" || game.status === "final";

  return (
    <article className="rounded-xl border border-white/10 bg-[#10281c] p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs uppercase tracking-[0.14em] text-white/60">
        <span className="truncate">{game.venue || "MLB"}</span>
        {live ? (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[0.65rem] font-bold text-white">
            LIVE{game.inning ? ` · ${game.inning}` : ""}
          </span>
        ) : (
          <span>{game.statusLabel}</span>
        )}
      </div>
      <div className="space-y-2">
        <p className="flex items-center justify-between font-heading text-lg">
          <span>{game.awayAbbr}</span>
          <span>{showScore ? game.awayScore : "—"}</span>
        </p>
        <p className="flex items-center justify-between font-heading text-lg">
          <span>{game.homeAbbr}</span>
          <span>{showScore ? game.homeScore : "—"}</span>
        </p>
      </div>
    </article>
  );
}

export default function MLBScores({ today = [], yesterday = [], error }) {
  if (error && !today.length && !yesterday.length) {
    return <p className="text-sm text-red-200">{error}</p>;
  }

  const blocks = [
    { label: "Hoy", games: today },
    { label: "Ayer", games: yesterday },
  ].filter((block) => block.games.length);

  if (!blocks.length) {
    return (
      <p className="text-sm text-white/70">
        No hay juegos de MLB para hoy. Fuera de temporada el marcador vuelve en marzo.
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {block.games.map((game) => (
              <ScoreCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
