import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleAdLayout from "@/components/ArticleAdLayout";
import JsonLd from "@/components/seo/JsonLd";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { destinationArticleSchema } from "@/lib/seo/schema";
import { ROUTES } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DESTINATIONS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
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
      image: destination.image,
      imageAlt: destination.imageAlt,
    },
  );
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = getDestination(slug);
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
            <p className="mt-3 text-sm font-medium text-primary dark:text-gold">
              Mejor época: {destination.bestTime}
            </p>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-edge">
              <Image
                src={destination.image}
                alt={destination.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-muted">Foto: Unsplash</p>
          </>
        }
        paragraphs={destination.body}
        footer={
          <Link
            href={ROUTES.tourism}
            className="mt-10 inline-block text-sm font-semibold text-primary hover:underline dark:text-gold"
          >
            ← Más destinos
          </Link>
        }
      />
    </>
  );
}
