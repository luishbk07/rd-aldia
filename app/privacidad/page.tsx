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
        Última actualización: 3 de septiembre de 2026. Esta página explica qué
        datos trata {SITE_NAME}, para qué los usamos y qué puedes pedir. Google
        AdSense exige que el sitio publique una política de privacidad visible.
      </p>

      <div className="mt-10 space-y-8 text-base leading-7 text-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Quién es responsable
          </h2>
          <p className="mt-2 text-muted">
            El responsable es {SITE_NAME}, un medio digital con sede en Santo
            Domingo, República Dominicana. Para privacidad o ejercicio de
            derechos, escribe a{" "}
            <a className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            o usa la{" "}
            <Link className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold" href={ROUTES.contact}>
              página de contacto
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Qué datos se recogen
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted">
            <li>
              <strong className="text-heading">Formularios.</strong> Si nos
              escribes, guardamos nombre, correo, asunto y mensaje para
              responderte.
            </li>
            <li>
              <strong className="text-heading">Analítica.</strong> Podemos usar
              Plausible (sin cookies, agregada) o Google Analytics 4 si está
              activado. Esas herramientas ven páginas visitadas, tipo de
              dispositivo y referente, no un perfil nominal.
            </li>
            <li>
              <strong className="text-heading">Cookies y almacenamiento.</strong>{" "}
              El tema claro/oscuro se guarda en tu navegador (
              <code className="text-heading">localStorage</code>
              ). Google AdSense y, si aplica, Google Analytics pueden colocar
              cookies propias o de terceros para medir y mostrar anuncios.
            </li>
            <li>
              <strong className="text-heading">Anuncios.</strong> AdSense
              (cuenta <code className="text-heading">ca-pub-7362041124232949</code>
              ) puede usar cookies para anuncios personalizados o no
              personalizados, según tu región y ajustes de Google.
            </li>
            <li>
              No pedimos cédula, tarjetas ni datos de salud. No vendemos listas
              de correos.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Cómo se usan
          </h2>
          <p className="mt-2 text-muted">
            Operar y mejorar el sitio, entender qué secciones se leen, mostrar
            publicidad, responder mensajes y cumplir obligaciones legales. No
            usamos tus datos para crédito, seguros ni decisiones automatizadas
            que te afecten.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Cookies de terceros
          </h2>
          <p className="mt-2 text-muted">
            Google, como socio de publicidad, puede usar cookies para servir
            anuncios según visitas previas a este u otros sitios. Puedes optar
            por no recibir anuncios personalizados en{" "}
            <a
              className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold"
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              adssettings.google.com
            </a>{" "}
            y revisar la política de Google en{" "}
            <a
              className="font-semibold text-primary underline-offset-2 hover:underline dark:text-gold"
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              policies.google.com/technologies/ads
            </a>
            . También puedes borrar cookies desde tu navegador.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Conservación y encargados
          </h2>
          <p className="mt-2 text-muted">
            Los mensajes de contacto se conservan el tiempo necesario para
            atenderlos. El alojamiento, analítica y anuncios pueden procesar
            datos fuera de República Dominicana (por ejemplo, Estados Unidos),
            bajo las condiciones de esos proveedores.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Tus derechos
          </h2>
          <p className="mt-2 text-muted">
            Puedes pedir acceso, corrección o eliminación de los datos que nos
            hayas enviado, y oponerte a cierto tratamiento cuando la ley lo
            permita. Responderemos en un plazo razonable. Si usas un bloqueador
            de anuncios o dejas de visitar el sitio, dejamos de recoger datos
            nuevos de tu navegador.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Menores
          </h2>
          <p className="mt-2 text-muted">
            El sitio está pensado para un público general. No dirigimos
            anuncios a menores de 13 años ni pedimos datos a esa edad a
            propósito.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-heading">
            Cambios
          </h2>
          <p className="mt-2 text-muted">
            Si cambia esta política, actualizamos la fecha de arriba. El uso
            continuado del sitio implica que leíste la versión vigente.
          </p>
        </section>
      </div>
    </div>
  );
}
