import type { Metadata } from "next";
import CultureCard from "@/components/CultureCard";
import { CULTURE_ARTICLES } from "@/data/culture-articles";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadata(PAGE_SEO.culture);

export default function CulturaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Identidad
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Cultura
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        El país no cabe en una postal de playa. Cabe en un colmado, un acordeón,
        una máscara de carnaval y un tambor que no se apagó.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CULTURE_ARTICLES.map((article) => (
          <CultureCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
