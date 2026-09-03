export const sportsResult = {
  name: "sportsResult",
  title: "Resultado deportivo",
  type: "document",
  fields: [
    {
      name: "league",
      title: "Liga",
      type: "string",
      options: {
        list: [
          { title: "LIDOM", value: "LIDOM" },
          { title: "MLB", value: "MLB" },
        ],
        layout: "radio",
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "homeTeam",
      title: "Equipo local",
      type: "string",
      validation: (Rule: { required: () => { min: (n: number) => unknown } }) =>
        Rule.required().min(2),
    },
    {
      name: "awayTeam",
      title: "Equipo visitante",
      type: "string",
      validation: (Rule: { required: () => { min: (n: number) => unknown } }) =>
        Rule.required().min(2),
    },
    {
      name: "homeScore",
      title: "Carreras local",
      type: "number",
      validation: (Rule: {
        required: () => { integer: () => { min: (n: number) => { max: (n: number) => unknown } } };
      }) => Rule.required().integer().min(0).max(99),
    },
    {
      name: "awayScore",
      title: "Carreras visitante",
      type: "number",
      validation: (Rule: {
        required: () => { integer: () => { min: (n: number) => { max: (n: number) => unknown } } };
      }) => Rule.required().integer().min(0).max(99),
    },
    {
      name: "date",
      title: "Fecha y hora",
      type: "datetime",
      options: { dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm" },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Programado", value: "scheduled" },
          { title: "En vivo", value: "live" },
          { title: "Final", value: "final" },
          { title: "Pospuesto", value: "postponed" },
          { title: "Cancelado", value: "canceled" },
        ],
      },
      initialValue: "scheduled",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: "Fecha, reciente",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      league: "league",
      home: "homeTeam",
      away: "awayTeam",
      homeScore: "homeScore",
      awayScore: "awayScore",
      status: "status",
    },
    prepare({
      league,
      home,
      away,
      homeScore,
      awayScore,
      status,
    }: {
      league?: string;
      home?: string;
      away?: string;
      homeScore?: number;
      awayScore?: number;
      status?: string;
    }) {
      return {
        title: `${away ?? "Visitante"} @ ${home ?? "Local"}`,
        subtitle: `${league ?? "Liga"} · ${awayScore ?? 0}–${homeScore ?? 0} · ${status ?? ""}`,
      };
    },
  },
};
