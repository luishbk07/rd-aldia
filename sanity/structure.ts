import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("RD Al Día")
    .items([
      S.documentTypeListItem("post").title("Artículos y blog"),
      S.documentTypeListItem("destination").title("Destinos"),
      S.divider(),
      S.documentTypeListItem("author").title("Autores"),
      S.documentTypeListItem("category").title("Categorías"),
    ]);
