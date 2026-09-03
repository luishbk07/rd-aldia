const dopPerGallon = (Rule: {
  required: () => {
    positive: () => { precision: (n: number) => { max: (n: number) => unknown } };
  };
}) => Rule.required().positive().precision(2).max(1000);

export const fuelPrice = {
  name: "fuelPrice",
  title: "Precio de combustible",
  type: "document",
  fields: [
    {
      name: "date",
      title: "Fecha",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      description: "Un registro por día. Precios en RD$ por galón.",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "gasolinePremium",
      title: "Gasolina premium",
      type: "number",
      description: "RD$ / galón",
      validation: dopPerGallon,
    },
    {
      name: "gasolineRegular",
      title: "Gasolina regular",
      type: "number",
      description: "RD$ / galón",
      validation: dopPerGallon,
    },
    {
      name: "diesel",
      title: "Diésel",
      type: "number",
      description: "RD$ / galón",
      validation: dopPerGallon,
    },
    {
      name: "propane",
      title: "Propano (GLP)",
      type: "number",
      description: "RD$ / galón",
      validation: dopPerGallon,
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
      date: "date",
      regular: "gasolineRegular",
      premium: "gasolinePremium",
    },
    prepare({
      date,
      regular,
      premium,
    }: {
      date?: string;
      regular?: number;
      premium?: number;
    }) {
      return {
        title: date ? `Combustible · ${date}` : "Combustible",
        subtitle: `Regular RD$${regular ?? "—"} · Premium RD$${premium ?? "—"}`,
      };
    },
  },
};
