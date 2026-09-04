import type { Metadata } from "next";
import Link from "next/link";
import RelatedLinks from "@/components/RelatedLinks";
import TourismExplorer from "@/components/TourismExplorer";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { SECTION_RELATED } from "@/lib/seo/related";
import { sanityConfigured } from "@/lib/sanity";
import { getTourismDestinations } from "@/lib/sanity-content";
import { ROUTES } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = pageMetadata(PAGE_SEO.tourism);

export default async function TurismoPage() {
  const destinations = await getTourismDestinations();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Viajar la isla
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Turismo en República Dominicana
      </h1>
      <p className="mt-4 mb-8 max-w-2xl text-base leading-7 text-muted">
        Destinos para locales y visitas: playa, montaña, ciudad colonial y un
        poco de aventura. Filtra y elige según el ánimo, no solo según el hotel.
        Mira el{" "}
        <Link href={ROUTES.weather} className="font-semibold text-primary hover:underline dark:text-gold">
          clima en República Dominicana
        </Link>{" "}
        y lee{" "}
        <Link href={ROUTES.culture} className="font-semibold text-primary hover:underline dark:text-gold">
          cultura dominicana
        </Link>{" "}
        antes de empacar.
      </p>
      {process.env.NODE_ENV !== "production" && !sanityConfigured() ? (
        <p className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
          Sanity no está conectado: falta{" "}
          <code className="font-mono">NEXT_PUBLIC_SANITY_PROJECT_ID</code> en{" "}
          <code className="font-mono">.env.local</code>. Copia{" "}
          <code className="font-mono">env.example</code>, pega el Project ID de{" "}
          <a
            href="https://www.sanity.io/manage"
            className="font-semibold underline"
            target="_blank"
            rel="noreferrer"
          >
            sanity.io/manage
          </a>
          , publica el artículo en Studio y reinicia{" "}
          <code className="font-mono">npm run dev</code>.
        </p>
      ) : null}
      <h2 className="mb-6 font-heading text-xl font-semibold text-heading">
        Destinos: playa, montaña y Zona Colonial
      </h2>
      <TourismExplorer destinations={destinations} />
      <RelatedLinks
        title="Cultura, clima y dólar RD"
        links={SECTION_RELATED.tourism}
      />
    </div>
  );
}
