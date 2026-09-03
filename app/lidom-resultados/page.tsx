import type { Metadata } from "next";
import SportsSection from "@/components/SportsSection";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadata(PAGE_SEO.sports);

export default function LidomResultadosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Béisbol
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        LIDOM y MLB
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        MLB se actualiza solo desde la Stats API. LIDOM no tiene API pública: los
        resultados se publican en el panel, igual que el combustible.
      </p>
      <div className="mt-10">
        <SportsSection />
      </div>
    </div>
  );
}
