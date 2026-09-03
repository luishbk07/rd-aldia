export const dailyVerse = {
  name: "dailyVerse",
  title: "Palabra del Día",
  type: "document",
  fields: [
    {
      name: "bibleVerse",
      title: "Versículo",
      type: "text",
      rows: 4,
      description: "Texto de la Escritura (no la cita).",
      validation: (Rule: {
        required: () => { min: (n: number) => { max: (n: number) => unknown } };
      }) => Rule.required().min(12).max(800),
    },
    {
      name: "translation",
      title: "Traducción",
      type: "string",
      options: {
        list: [
          { title: "Reina-Valera 1960", value: "RVR1960" },
          { title: "Nueva Versión Internacional", value: "NVI" },
          { title: "Dios Habla Hoy", value: "DHH" },
          { title: "Nueva Traducción Viviente", value: "NTV" },
          { title: "Traducción en Lenguaje Actual", value: "TLA" },
          { title: "Otra", value: "other" },
        ],
      },
      initialValue: "RVR1960",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "explanation",
      title: "Explicación",
      type: "text",
      rows: 6,
      description: "Nota breve para lectores dominicanos.",
      validation: (Rule: {
        required: () => { min: (n: number) => { max: (n: number) => unknown } };
      }) => Rule.required().min(40).max(2000),
    },
    {
      name: "date",
      title: "Fecha",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      description: "Un versículo por día.",
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
      verse: "bibleVerse",
      translation: "translation",
      date: "date",
    },
    prepare({
      verse,
      translation,
      date,
    }: {
      verse?: string;
      translation?: string;
      date?: string;
    }) {
      const snippet = verse ? `${verse.slice(0, 72)}${verse.length > 72 ? "…" : ""}` : "Palabra del Día";
      return {
        title: snippet,
        subtitle: `${date ?? "Sin fecha"} · ${translation ?? ""}`,
      };
    },
  },
};
