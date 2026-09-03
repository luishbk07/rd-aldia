import { PinIcon } from "@sanity/icons/Pin";
import { defineField, defineType } from "sanity";

export const destinationType = defineType({
  name: "destination",
  title: "Destino",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "Región",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "bestTimeToVisit",
      title: "Mejor época para visitar",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Playa", value: "beach" },
          { title: "Montaña", value: "mountain" },
          { title: "Ciudad", value: "city" },
          { title: "Colonial", value: "colonial" },
          { title: "Aventura", value: "adventure" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Destacado en inicio",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Artículo (opcional)",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "region",
      media: "image",
    },
  },
});
