import CultureCard from "@/components/CultureCard";
import DestinationCard from "@/components/DestinationCard";
import { Button, SectionTitle } from "@/components/ui";
import {
  getFeaturedCulturePosts,
  getFeaturedTourism,
} from "@/lib/sanity-content";
import { ROUTES } from "@/lib/site";

export default async function HomeFeatured() {
  const [culture, destinations] = await Promise.all([
    getFeaturedCulturePosts(),
    getFeaturedTourism(),
  ]);

  return (
    <section id="destacados" className="mt-14">
      <SectionTitle eyebrow="Editorial">Lo más destacado</SectionTitle>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Lecturas de cultura y destinos para compartir. Entra a las secciones
        para el archivo completo.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {culture.map((article) => (
          <CultureCard key={article.slug} article={article} />
        ))}
        {destinations.map((destination) => (
          <DestinationCard key={destination.slug} destination={destination} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={ROUTES.culture} variant="outline">
          Más cultura
        </Button>
        <Button href={ROUTES.tourism} variant="outline">
          Más turismo
        </Button>
      </div>
    </section>
  );
}
