import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import ConversionTracker from "@/components/seo/ConversionTracker";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { AD_SIZES } from "@/lib/ads";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGE_SEO.advertise);

const PACKAGES = [
  {
    name: "Leaderboard",
    size: "728×90",
    place: "Debajo del encabezado, en todas las páginas públicas.",
    note: "Máxima visibilidad en escritorio.",
  },
  {
    name: "Rectangle",
    size: "300×250",
    place: "Barra lateral en artículos (escritorio) y tras el segundo párrafo en móvil.",
    note: "Junto a cultura, turismo y noticias.",
  },
  {
    name: "Mobile Banner",
    size: "320×50",
    place: "Entre secciones en la portada y en la cabecera móvil.",
    note: "Formato corto para el teléfono.",
  },
];

export default function AnunciatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <ConversionTracker event="advertise_view" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Publicidad
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Anúnciate en {SITE_NAME}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Llegamos a quien abre el día con combustible, dólar, titulares y
        béisbol. Los espacios de abajo son los tamaños reales. AdSense ya está
        en el sitio; las unidades se llenan cuando Google apruebe la cuenta.
      </p>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-heading">
          Formatos
        </h2>
        <ul className="mt-4 divide-y divide-edge rounded-xl border border-edge bg-surface">
          {PACKAGES.map((item) => (
            <li key={item.name} className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                {item.size}
              </p>
              <p className="mt-1 font-heading text-lg font-semibold text-heading">
                {item.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">{item.place}</p>
              <p className="mt-1 text-sm text-heading">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-heading">
          Cómo se ve
        </h2>
        <p className="mt-2 text-sm text-muted">
          Placeholders de muestra. El mismo componente sirve cuando pegues el
          código de AdSense.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <AdSlot
            size="leaderboard"
            lazy={false}
            fallbackContent={
              <div className="flex h-full items-center justify-center text-sm font-semibold text-heading">
                Muestra · {AD_SIZES.leaderboard.label}
              </div>
            }
          />
          <AdSlot
            size="rectangle"
            lazy={false}
            fallbackContent={
              <div className="flex h-full items-center justify-center text-sm font-semibold text-heading">
                Muestra · {AD_SIZES.rectangle.label}
              </div>
            }
          />
          <AdSlot
            size="mobile-banner"
            lazy={false}
            fallbackContent={
              <div className="flex h-full items-center justify-center text-sm font-semibold text-heading">
                Muestra · {AD_SIZES["mobile-banner"].label}
              </div>
            }
          />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-edge bg-surface p-6">
        <h2 className="font-heading text-xl font-semibold text-heading">
          Habla con nosotros
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Escribe a{" "}
          <a
            href="mailto:anuncios@rdaldia.com"
            className="font-semibold text-accent hover:underline"
          >
            anuncios@rdaldia.com
          </a>{" "}
          o usa el formulario. Es una plantilla: el correo abre tu cliente.
        </p>
        <form
          className="mt-6 space-y-4"
          action="mailto:anuncios@rdaldia.com"
          method="post"
          encType="text/plain"
        >
          <label className="block text-sm font-medium text-heading">
            Nombre
            <input
              name="nombre"
              required
              className="mt-1 w-full rounded-md border border-edge bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-heading">
            Empresa
            <input
              name="empresa"
              className="mt-1 w-full rounded-md border border-edge bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-heading">
            Correo
            <input
              type="email"
              name="correo"
              required
              className="mt-1 w-full rounded-md border border-edge bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-heading">
            Mensaje
            <textarea
              name="mensaje"
              rows={4}
              required
              className="mt-1 w-full rounded-md border border-edge bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Enviar consulta
          </button>
        </form>
      </section>
    </div>
  );
}
