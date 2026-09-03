import type { Metadata } from "next";
import TourismExplorer from "@/components/TourismExplorer";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadata(PAGE_SEO.tourism);

export default function TurismoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Viajar la isla
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Turismo
      </h1>
      <p className="mt-4 mb-8 max-w-2xl text-base leading-7 text-muted">
        Ocho destinos para locales y visitas: playa, montaña, ciudad colonial y
        un poco de aventura. Filtra y elige según el ánimo, no solo según el
        hotel.
      </p>
      <TourismExplorer />
    </div>
  );
}
