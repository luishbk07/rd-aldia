const dopRate = (Rule: {
  required: () => {
    positive: () => { precision: (n: number) => { max: (n: number) => unknown } };
  };
}) => Rule.required().positive().precision(2).max(500);

export const exchangeRate = {
  name: "exchangeRate",
  title: "Tasa de cambio",
  type: "document",
  fields: [
    {
      name: "date",
      title: "Fecha",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      description: "Un registro por día. Compra/venta en RD$ por 1 USD o 1 EUR.",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "usdBuy",
      title: "USD compra",
      type: "number",
      description: "RD$ por 1 dólar",
      validation: dopRate,
    },
    {
      name: "usdSell",
      title: "USD venta",
      type: "number",
      description: "RD$ por 1 dólar",
      validation: (Rule: {
        required: () => {
          positive: () => {
            precision: (n: number) => {
              max: (n: number) => { custom: (fn: (sell: number, ctx: { parent?: { usdBuy?: number } }) => true | string) => unknown };
            };
          };
        };
      }) =>
        Rule.required()
          .positive()
          .precision(2)
          .max(500)
          .custom((sell, context) => {
            const buy = context.parent?.usdBuy;
            if (sell != null && buy != null && sell < buy) {
              return "La venta USD debe ser mayor o igual que la compra.";
            }
            return true;
          }),
    },
    {
      name: "euroBuy",
      title: "EUR compra",
      type: "number",
      description: "RD$ por 1 euro",
      validation: dopRate,
    },
    {
      name: "euroSell",
      title: "EUR venta",
      type: "number",
      description: "RD$ por 1 euro",
      validation: (Rule: {
        required: () => {
          positive: () => {
            precision: (n: number) => {
              max: (n: number) => { custom: (fn: (sell: number, ctx: { parent?: { euroBuy?: number } }) => true | string) => unknown };
            };
          };
        };
      }) =>
        Rule.required()
          .positive()
          .precision(2)
          .max(500)
          .custom((sell, context) => {
            const buy = context.parent?.euroBuy;
            if (sell != null && buy != null && sell < buy) {
              return "La venta EUR debe ser mayor o igual que la compra.";
            }
            return true;
          }),
    },
    {
      name: "goldPrice",
      title: "Oro",
      type: "number",
      description: "USD por onza troy",
      validation: (Rule: {
        required: () => {
          positive: () => { precision: (n: number) => { max: (n: number) => unknown } };
        };
      }) => Rule.required().positive().precision(2).max(20000),
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
    select: { date: "date", usdSell: "usdSell", goldPrice: "goldPrice" },
    prepare({
      date,
      usdSell,
      goldPrice,
    }: {
      date?: string;
      usdSell?: number;
      goldPrice?: number;
    }) {
      return {
        title: date ? `Divisas · ${date}` : "Divisas",
        subtitle: `USD venta RD$${usdSell ?? "—"} · Oro US$${goldPrice ?? "—"}/oz`,
      };
    },
  },
};
