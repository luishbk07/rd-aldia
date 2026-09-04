import type { Metadata } from "next";
import { Suspense } from "react";
import AdSlot from "@/components/AdSlot";
import CurrencyTracker from "@/components/CurrencyTracker";
import DailyVerse from "@/components/DailyVerse";
import FinancialTip from "@/components/FinancialTip";
import FuelPrices from "@/components/FuelPrices";
import HomeFeatured from "@/components/HomeFeatured";
import NewsAggregator from "@/components/NewsAggregator";
import NewsletterForm from "@/components/NewsletterForm";
import SportsSection from "@/components/SportsSection";
import WeatherSection from "@/components/WeatherSection";
import { Button, SectionTitle } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { ROUTES } from "@/lib/site";

export const revalidate = 60;
export const metadata: Metadata = pageMetadata(PAGE_SEO.home);

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl">
        <SectionTitle eyebrow="Hoy en República Dominicana" as="h1">
          Noticias y datos de República Dominicana
        </SectionTitle>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Combustible, dólar, clima, béisbol, titulares, un versículo y un
          consejo de bolsillo. Cultura y turismo para no olvidar el país más
          allá de las cifras.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={ROUTES.fuel} variant="primary">
            Ver combustible
          </Button>
          <Button href={ROUTES.dollar} variant="secondary">
            Tasa del dólar
          </Button>
          <Button href={ROUTES.weather} variant="outline">
            Clima
          </Button>
          <Button href={ROUTES.verse} variant="outline">
            Palabra del Día
          </Button>
          <Button href={ROUTES.finance} variant="outline">
            Consejo financiero
          </Button>
          <Button href={ROUTES.news} variant="outline">
            Noticias
          </Button>
          <Button href={ROUTES.sports} variant="outline">
            LIDOM resultados
          </Button>
          <Button href={ROUTES.culture} variant="outline">
            Cultura
          </Button>
          <Button href={ROUTES.tourism} variant="outline">
            Turismo
          </Button>
        </div>
      </section>

      <section id="datos-del-dia" className="mt-14">
        <SectionTitle>Combustible, dólar y LIDOM de hoy</SectionTitle>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <FuelPrices variant="teaser" />
          <CurrencyTracker variant="teaser" />
          <SportsSection variant="teaser" />
        </div>
      </section>

      <section id="clima" className="mt-14">
        <WeatherSection />
      </section>

      <div className="mt-10 flex justify-center md:hidden">
        <AdSlot size="mobile-banner" position="home-after-datos" />
      </div>

      <section id="palabra-del-dia" className="mt-14">
        <SectionTitle eyebrow="Cada mañana">Palabra del Día y consejo financiero</SectionTitle>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Un versículo y un consejo financiero para reflexionar cada día.
          Contenido nuevo todos los días.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <DailyVerse />
          <FinancialTip />
        </div>
      </section>

      <Suspense
        fallback={
          <section className="mt-14">
            <div className="h-8 w-56 animate-pulse rounded bg-edge" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-64 animate-pulse rounded-xl bg-edge/70" />
              ))}
            </div>
          </section>
        }
      >
        <HomeFeatured />
      </Suspense>

      <div className="mt-10 flex justify-center md:hidden">
        <AdSlot size="mobile-banner" position="home-after-destacados" />
      </div>

      <section
        id="boletin"
        className="mt-14 rounded-2xl border border-primary/20 bg-gradient-to-br from-sky-50 to-white px-5 py-8 sm:px-8 dark:border-gold/25 dark:from-primary/30 dark:to-surface"
      >
        <SectionTitle eyebrow="Boletín">Noticias de República Dominicana en tu correo</SectionTitle>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          Combustible, dólar y titulares. Un envío al día, según el calendario
          de Santo Domingo.
        </p>
        <div className="mt-6 max-w-lg">
          <NewsletterForm id="newsletter-home-email" />
        </div>
      </section>

      <section id="noticias" className="mt-14 max-w-3xl">
        <NewsAggregator limit={12} />
      </section>
    </div>
  );
}
