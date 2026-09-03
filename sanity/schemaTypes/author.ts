export const author = {
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    { name: "role", title: "Cargo", type: "string" },
    { name: "bio", title: "Biografía", type: "text", rows: 3 },
    {
      name: "photo",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Texto alternativo", type: "string" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
};
