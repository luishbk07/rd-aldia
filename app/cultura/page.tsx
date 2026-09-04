import type { Metadata } from "next";
import Link from "next/link";
import CultureCard from "@/components/CultureCard";
import RelatedLinks from "@/components/RelatedLinks";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { SECTION_RELATED } from "@/lib/seo/related";
import { getCulturePosts } from "@/lib/sanity-content";
import { ROUTES } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = pageMetadata(PAGE_SEO.culture);

export default async function CulturaPage() {
  const articles = await getCulturePosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Identidad
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Cultura dominicana
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        El país no cabe en una postal de playa. Cabe en un colmado, un acordeón,
        una máscara de carnaval y un tambor que no se apagó. Después, camina los{" "}
        <Link href={ROUTES.tourism} className="font-semibold text-primary hover:underline dark:text-gold">
          destinos de turismo
        </Link>{" "}
        que esas tradiciones todavía habitan.
      </p>
      <h2 className="mt-10 font-heading text-xl font-semibold text-heading">
        Tradiciones, merengue y bachata
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <CultureCard key={article.slug} article={article} />
        ))}
      </div>
      <RelatedLinks
        title="Turismo, LIDOM y noticias"
        links={SECTION_RELATED.culture}
      />
    </div>
  );
}
