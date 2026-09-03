export const article = {
  name: "article",
  title: "Artículo",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule: { required: () => unknown; min: (n: number) => { max: (n: number) => unknown } }) =>
        Rule.required().min(4).max(140),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Noticias", value: "noticias" },
          { title: "Nacionales", value: "nacionales" },
          { title: "Cultura", value: "cultura" },
          { title: "Turismo", value: "turismo" },
          { title: "Deportes", value: "deportes" },
          { title: "Opinión", value: "opinion" },
        ],
        layout: "radio",
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "featuredImage",
      title: "Imagen destacada",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (Rule: { required: () => unknown }) => Rule.required(),
        },
        { name: "caption", title: "Pie de foto", type: "string" },
      ],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Extracto",
      type: "text",
      rows: 3,
      validation: (Rule: {
        required: () => { min: (n: number) => { max: (n: number) => unknown } };
      }) => Rule.required().min(20).max(280),
    },
    {
      name: "content",
      title: "Contenido",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Cita", value: "blockquote" },
          ],
          lists: [
            { title: "Viñetas", value: "bullet" },
            { title: "Numerada", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Enlace",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Texto alternativo",
              validation: (Rule: { required: () => unknown }) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule: { required: () => { min: (n: number) => unknown } }) =>
        Rule.required().min(1),
    },
    {
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      options: { dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm" },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: "Más recientes",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "featuredImage",
    },
  },
};
