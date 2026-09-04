import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleAdLayout from "@/components/ArticleAdLayout";
import JsonLd from "@/components/seo/JsonLd";
import { CULTURE_ARTICLES } from "@/data/culture-articles";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { newsArticleSchema } from "@/lib/seo/schema";
import { getCulturePost, getCulturePosts } from "@/lib/sanity-content";
import { ROUTES } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getCulturePosts();
  const slugs = new Set([
    ...CULTURE_ARTICLES.map((article) => article.slug),
    ...posts.map((article) => article.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCulturePost(slug);
  if (!article) return pageMetadata(PAGE_SEO.culture);

  return pageMetadata(
    {
      title: article.title,
      description: article.excerpt,
      path: `${ROUTES.culture}/${article.slug}`,
      keywords: ["cultura dominicana", "artículo", article.title],
    },
    {
      type: "article",
      image: article.image,
      imageAlt: article.imageAlt,
      publishedTime: article.publishedAt,
    },
  );
}

export default async function CultureArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getCulturePost(slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd data={newsArticleSchema(article)} />
      <ArticleAdLayout
        intro={
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Cultura · {article.readMinutes} min de lectura
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted">{article.excerpt}</p>
            {article.image ? (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-edge">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </>
        }
        paragraphs={article.body}
        content={article.content}
        footer={
          <Link
            href={ROUTES.culture}
            className="mt-10 inline-block text-sm font-semibold text-primary hover:underline dark:text-gold"
          >
            ← Más cultura
          </Link>
        }
      />
    </>
  );
}
