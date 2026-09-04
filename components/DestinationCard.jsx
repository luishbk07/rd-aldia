import Image from "next/image";
import Link from "next/link";
import { DESTINATION_CATEGORIES } from "@/data/destinations";
import { ROUTES } from "@/lib/site";

export default function DestinationCard({ destination }) {
  const labels = (destination.categories || [])
    .map((id) => DESTINATION_CATEGORIES.find((item) => item.id === id)?.label)
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-edge bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[16/10] overflow-hidden bg-edge">
        <Image
          src={destination.image}
          alt={
            destination.imageAlt ||
            `${destination.name} — turismo en República Dominicana`
          }
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {destination.region ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-foreground/70 dark:text-gold">
            {destination.region}
          </p>
        ) : null}
        <h3 className="mt-1 font-heading text-xl font-semibold tracking-tight text-heading">
          {destination.name}
        </h3>
        {destination.bestTime ? (
          <p className="mt-2 text-xs font-medium text-primary dark:text-gold">
            Mejor época: {destination.bestTime}
          </p>
        ) : null}
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{destination.description}</p>
        {labels ? (
          <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
            {labels}
          </p>
        ) : null}
        <Link
          href={`${ROUTES.tourism}/${destination.slug}`}
          className="mt-4 text-sm font-semibold text-primary hover:underline dark:text-gold"
        >
          Ver más
        </Link>
      </div>
    </article>
  );
}
