import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/site";

export default function CultureCard({ article }) {
  return (
    <Link
      href={`${ROUTES.culture}/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-edge bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover dark:hover:border-gold/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-edge">
        <Image
          src={article.image}
          alt={article.imageAlt || `${article.title} — cultura dominicana`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Cultura · {article.readMinutes} min de lectura
        </p>
        <h3 className="mt-2 font-heading text-lg font-semibold tracking-tight text-heading">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{article.excerpt}</p>
        <span className="mt-4 text-sm font-semibold text-primary group-hover:underline dark:text-gold">
          Leer artículo
        </span>
      </div>
    </Link>
  );
}
