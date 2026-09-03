import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { searchSite } from "@/lib/seo/search";
import { getCulturePosts, getTourismDestinations } from "@/lib/sanity-content";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGE_SEO.search);

type Props = { searchParams: Promise<{ q?: string }> };

export default async function BuscarPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const [culture, tourism] = await Promise.all([
    getCulturePosts(),
    getTourismDestinations(),
  ]);
  const results = searchSite(query, { culture, tourism });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Buscar
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Buscar en RD Al Día
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Secciones, cultura y destinos. Escribe al menos dos letras.
      </p>

      <form action={ROUTES.search} method="get" className="mt-8 flex gap-2" role="search">
        <label className="sr-only" htmlFor="site-search">
          Término de búsqueda
        </label>
        <input
          id="site-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Ej. combustible, bachata, Samaná"
          className="min-w-0 flex-1 rounded-md border border-edge bg-surface px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Buscar
        </button>
      </form>

      {query.length >= 2 ? (
        <div className="mt-10">
          <p className="text-sm text-muted">
            {results.length} resultado{results.length === 1 ? "" : "s"} para “{query}”
          </p>
          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No encontramos eso. Prueba con combustible, dólar, LIDOM o un destino.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-edge">
              {results.map((item) => (
                <li key={item.href} className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                    {item.type}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-1 block font-heading text-lg font-semibold text-heading hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.excerpt}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
