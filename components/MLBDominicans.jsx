"use client";

export default function MLBDominicans({ players = [], error }) {
  if (error && !players.length) {
    return <p className="text-sm text-red-200">{error}</p>;
  }

  if (!players.length) {
    return (
      <p className="text-sm text-white/70">
        No se pudieron cargar las estadísticas de MLB. Reintenta en unos minutos.
      </p>
    );
  }

  return (
    <div>
      <h3 className="mb-3 font-heading text-lg font-semibold">Dominicanos en MLB 🇩🇴</h3>
      <p className="mb-3 text-sm text-white/65">
        Temporada en curso · AVG, HR, RBI y OPS vía Stats API (sin intervención manual).
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[640px] w-full text-left text-sm text-white">
          <thead className="bg-black/25 text-xs uppercase tracking-[0.12em] text-white/60">
            <tr>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Jugador</th>
              <th className="px-3 py-3">Equipo</th>
              <th className="px-3 py-3">AVG</th>
              <th className="px-3 py-3">HR</th>
              <th className="px-3 py-3">RBI</th>
              <th className="px-3 py-3">OPS</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id || player.playerName} className="border-t border-white/10">
                <td className="px-3 py-3 text-white/50">{index + 1}</td>
                <td className="px-3 py-3 font-medium">🇩🇴 {player.playerName}</td>
                <td className="px-3 py-3">{player.team}</td>
                <td className="px-3 py-3">{player.avg}</td>
                <td className="px-3 py-3">{player.homeRuns}</td>
                <td className="px-3 py-3">{player.rbi}</td>
                <td className="px-3 py-3 font-semibold text-[#e2c08d]">{player.ops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
