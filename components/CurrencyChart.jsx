"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CurrencyChart({ history }) {
  const data = (history || []).map((row) => ({
    date: row.date.slice(5),
    Dólar: Number(row.usdRate),
    Euro: Number(row.euroRate),
  }));

  if (data.length < 2) {
    return (
      <p className="text-sm text-muted">
        El gráfico aparece cuando hay al menos dos días guardados.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e8ee" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("es-DO", {
                style: "currency",
                currency: "DOP",
              }).format(value)
            }
          />
          <Legend />
          <Line type="monotone" dataKey="Dólar" stroke="#003366" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Euro" stroke="#5b3a9e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
