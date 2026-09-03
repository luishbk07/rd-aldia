import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FuelPrices from "@/components/FuelPrices";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadata(PAGE_SEO.fuel);

export default function CombustibleHoyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Datos semanales
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Combustible hoy
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        El MICM fija los precios cada viernes. No hay API en tiempo real: RD Al
        Día publica la vigencia semanal (cinco productos al consumidor).
      </p>
      <div className="mt-8 flex justify-center md:hidden">
        <AdSlot size="mobile-banner" position="section-between" />
      </div>
      <div className="mt-10">
        <FuelPrices />
      </div>
    </div>
  );
}
