import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CULTURE_ARTICLES, getCultureArticle } from "@/data/culture-articles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CULTURE_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getCultureArticle(slug);
  return { title: article?.title ?? "Cultura" };
}

export default async function CultureArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getCultureArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Cultura · {article.readMinutes} min de lectura
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">{article.excerpt}</p>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-edge">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      <p className="mt-2 text-xs text-muted">Foto: Unsplash</p>
      <div className="mt-8 space-y-5 text-base leading-7 text-foreground">
        {article.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <Link
        href="/cultura"
        className="mt-10 inline-block text-sm font-semibold text-primary hover:underline dark:text-gold"
      >
        ← Más cultura
      </Link>
    </article>
  );
}
