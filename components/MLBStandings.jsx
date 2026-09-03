"use client";

export default function MLBStandings({ divisions = [], error }) {
  if (error && !divisions.length) {
    return <p className="text-sm text-red-200">{error}</p>;
  }

  if (!divisions.length) {
    return <p className="text-sm text-white/70">Aún no hay tabla de posiciones de MLB.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {divisions.map((division) => (
        <div key={division.name} className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-[420px] w-full text-left text-sm text-white">
            <thead className="bg-black/25 text-xs uppercase tracking-[0.12em] text-white/60">
              <tr>
                <th className="px-3 py-3" colSpan={2}>
                  {division.name}
                </th>
                <th className="px-3 py-3">G</th>
                <th className="px-3 py-3">P</th>
                <th className="px-3 py-3">PCT</th>
                <th className="px-3 py-3">GB</th>
              </tr>
            </thead>
            <tbody>
              {division.teams.map((row, index) => (
                <tr key={row.id || row.team} className="border-t border-white/10">
                  <td className="px-3 py-2 text-white/50">{index + 1}</td>
                  <td className="px-3 py-2 font-medium">
                    {row.abbreviation}{" "}
                    <span className="hidden font-normal text-white/60 sm:inline">{row.team}</span>
                  </td>
                  <td className="px-3 py-2">{row.wins}</td>
                  <td className="px-3 py-2">{row.losses}</td>
                  <td className="px-3 py-2">{row.pct}</td>
                  <td className="px-3 py-2">{row.gamesBack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
