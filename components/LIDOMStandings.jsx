"use client";

import { findTeam } from "@/lib/sports/lidom";

export default function LIDOMStandings({ standings = [] }) {
  if (!standings.length) {
    return <p className="text-sm text-white/70">Aún no hay tabla de posiciones.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-[520px] w-full text-left text-sm text-white">
        <thead className="bg-black/25 text-xs uppercase tracking-[0.12em] text-white/60">
          <tr>
            <th className="px-3 py-3">Equipo</th>
            <th className="px-3 py-3">G</th>
            <th className="px-3 py-3">P</th>
            <th className="px-3 py-3">PCT</th>
            <th className="px-3 py-3">GB</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => {
            const team = findTeam(row.team);
            return (
              <tr key={row.id || row.team} className="border-t border-white/10">
                <td className="px-3 py-3 font-medium">
                  {index + 1}. {team.emoji} {team.short}
                </td>
                <td className="px-3 py-3">{row.wins}</td>
                <td className="px-3 py-3">{row.losses}</td>
                <td className="px-3 py-3">{Number(row.pct).toFixed(3).replace(/^0/, "")}</td>
                <td className="px-3 py-3">{row.gamesBack === 0 ? "—" : row.gamesBack}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
