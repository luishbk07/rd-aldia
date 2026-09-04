import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { CONTACT_EMAIL, ROUTES, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGE_SEO.privacy);

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Legal
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Política de Privacidad
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Última actualización: 3 de septiembre de 2026.
      </p>

      <div className="mt-10 space-y-8 text-base leading-7 text-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Quiénes somos
          </h2>
          <p className="mt-2 text-muted">
            {SITE_NAME} es un medio digital dominicano, con sede en Santo
            Domingo. Publicamos lo que importa en el día a día: combustible,
            dólar, clima, deportes, titulares, cultura y turismo. Esta página
            explica, en palabras sencillas, cómo cuidamos tu información.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Qué datos recogemos
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted">
            <li>
              Si nos escribes, guardamos tu correo para responderte. También
              podemos guardar tu nombre y el mensaje, solo para esa conversación.
            </li>
            <li>
              Si te suscribes al boletín, guardamos tu correo para enviarte
              el resumen del día. Puedes pedirnos que lo borremos cuando quieras.
            </li>
            <li>
              Usamos herramientas de medición para saber qué secciones se leen
              más (por ejemplo, cuántas personas visitan Clima o Deportes). Eso
              no nos dice tu nombre.
            </li>
            <li>
              Nuestro sitio utiliza Google AdSense para mostrar publicidad.
              Google AdSense puede usar cookies para mostrar anuncios
              personalizados o no personalizados.
            </li>
            <li>
              Datos del clima actualizados automáticamente. Datos deportivos
              en tiempo real. Eso no requiere tus datos personales.
            </li>
            <li>
              No pedimos cédula, tarjetas ni datos de salud. No vendemos tu
              correo.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Cómo los usamos
          </h2>
          <p className="mt-2 text-muted">
            Los usamos para mejorar el contenido, mostrar anuncios que ayudan a
            sostener el medio, responder tus mensajes y enviarte el boletín si
            te suscribiste. Tu información se guarda en nuestra base de datos
            segura. No la usamos para crédito, seguros ni para tomar decisiones
            automáticas que te afecten.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Anuncios y cookies
          </h2>
          <p className="mt-2 text-muted">
            Google puede mostrar anuncios según visitas a este u otros sitios.
            Si no quieres anuncios personalizados, puedes cambiarlo en{" "}
            <a
              className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold"
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              la configuración de anuncios de Google
            </a>
            . También puedes borrar las cookies desde tu navegador. Más
            información sobre cómo Google usa los datos está en{" "}
            <a
              className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold"
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              la política de anuncios de Google
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Tus derechos
          </h2>
          <p className="mt-2 text-muted">
            Puedes pedirnos que te mostremos, corrijamos o borremos los datos
            que nos hayas enviado. Escríbenos y lo atenderemos en un plazo
            razonable. Si dejas de visitar el sitio, no recogeremos información
            nueva de tu visita.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Menores
          </h2>
          <p className="mt-2 text-muted">
            El sitio es para un público general. No pedimos datos a menores de
            13 años ni dirigimos anuncios a esa edad.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Cambios
          </h2>
          <p className="mt-2 text-muted">
            Si actualizamos esta política, cambiaremos la fecha de arriba.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Contacto
          </h2>
          <p className="mt-2 text-muted">
            Para privacidad, el boletín o cualquier duda, escribe a{" "}
            <a
              className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>{" "}
            o usa la{" "}
            <Link
              className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold"
              href={ROUTES.contact}
            >
              página de contacto
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
