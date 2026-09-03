import CultureCard from "@/components/CultureCard";
import CurrencyTracker from "@/components/CurrencyTracker";
import DailyVerse from "@/components/DailyVerse";
import DestinationCard from "@/components/DestinationCard";
import FinancialTip from "@/components/FinancialTip";
import FuelPrices from "@/components/FuelPrices";
import NewsAggregator from "@/components/NewsAggregator";
import SportsSection from "@/components/SportsSection";
import { Button, SectionTitle } from "@/components/ui";
import { featuredCulture } from "@/data/culture-articles";
import { featuredDestinations } from "@/data/destinations";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl">
        <SectionTitle eyebrow="Hoy en República Dominicana" as="h1">
          Todo lo que importa, al día.
        </SectionTitle>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Combustible, dólar, béisbol, titulares, un versículo y un consejo de
          bolsillo. Cultura y turismo para no olvidar el país más allá de las
          cifras.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/combustible" variant="primary">
            Ver combustible
          </Button>
          <Button href="/dolar" variant="secondary">
            Tasa del dólar
          </Button>
          <Button href="/palabra-del-dia" variant="outline">
            Palabra del Día
          </Button>
          <Button href="/consejo-financiero" variant="outline">
            Consejo financiero
          </Button>
          <Button href="/noticias" variant="outline">
            Noticias
          </Button>
          <Button href="/deportes" variant="outline">
            Deportes
          </Button>
        </div>
      </section>

      <section id="datos-del-dia" className="mt-14">
        <SectionTitle>Datos del día</SectionTitle>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <FuelPrices variant="teaser" />
          <CurrencyTracker variant="teaser" />
          <SportsSection variant="teaser" />
        </div>
      </section>

      <section id="palabra-del-dia" className="mt-14">
        <SectionTitle eyebrow="Cada mañana">Para el día</SectionTitle>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Un versículo y un consejo de bolsillo. Cambian solos, según el
          calendario de Santo Domingo.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <DailyVerse />
          <FinancialTip />
        </div>
      </section>

      <section id="destacados" className="mt-14">
        <SectionTitle eyebrow="Editorial">Lo más destacado</SectionTitle>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Lecturas de cultura y destinos para compartir. Entra a las secciones
          para el archivo completo.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCulture().map((article) => (
            <CultureCard key={article.slug} article={article} />
          ))}
          {featuredDestinations().map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/cultura" variant="outline">
            Más cultura
          </Button>
          <Button href="/turismo" variant="outline">
            Más turismo
          </Button>
        </div>
      </section>

      <section id="noticias" className="mt-14 max-w-3xl">
        <NewsAggregator limit={12} />
      </section>
    </div>
  );
}
