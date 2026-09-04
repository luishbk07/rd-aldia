import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleAdLayout from "@/components/ArticleAdLayout";
import JsonLd from "@/components/seo/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { DESTINATIONS } from "@/data/destinations";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { relatedForTourism } from "@/lib/seo/related";
import { destinationArticleSchema } from "@/lib/seo/schema";
import {
  getCulturePosts,
  getTourismDestination,
  getTourismDestinations,
} from "@/lib/sanity-content";
import { ROUTES } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const live = await getTourismDestinations();
  const slugs = new Set([
    ...DESTINATIONS.map((item) => item.slug),
    ...live.map((item) => item.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getTourismDestination(slug);
  if (!destination) return pageMetadata(PAGE_SEO.tourism);

  return pageMetadata(
    {
      title: destination.name,
      description: destination.description,
      path: `${ROUTES.tourism}/${destination.slug}`,
      keywords: [
        "turismo RD",
        destination.region,
        destination.name,
        ...destination.categories,
      ],
    },
    {
      type: "article",
      articleExcerpt: true,
      image: destination.image,
      imageAlt:
        destination.imageAlt ||
        `${destination.name} — turismo en República Dominicana`,
      publishedTime: destination.publishedAt,
    },
  );
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const [destination, destinations, articles] = await Promise.all([
    getTourismDestination(slug),
    getTourismDestinations(),
    getCulturePosts(),
  ]);
  if (!destination) notFound();

  return (
    <>
      <JsonLd data={destinationArticleSchema(destination)} />
      <ArticleAdLayout
        intro={
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Turismo · {destination.region}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
              {destination.name}
            </h1>
            {destination.bestTime ? (
              <p className="mt-3 text-sm font-medium text-primary dark:text-gold">
                Mejor época: {destination.bestTime}
              </p>
            ) : null}
            {destination.image ? (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-edge">
                <Image
                  src={destination.image}
                  alt={
                    destination.imageAlt ||
                    `${destination.name} — turismo en República Dominicana`
                  }
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </>
        }
        paragraphs={destination.body}
        content={destination.content}
        shareTitle={destination.name}
        sharePath={`${ROUTES.tourism}/${destination.slug}`}
        footer={
          <>
            <RelatedLinks
              title="Cultura dominicana y más destinos"
              headingLevel="h2"
              links={relatedForTourism(destination.slug, {
                destinations,
                articles,
              })}
            />
            <Link
              href={ROUTES.tourism}
              className="mt-6 inline-block text-sm font-semibold text-primary hover:underline dark:text-gold"
            >
              ← Más turismo en República Dominicana
            </Link>
          </>
        }
      />
    </>
  );
}
