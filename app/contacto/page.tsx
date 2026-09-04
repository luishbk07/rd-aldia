import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { CONTACT_EMAIL, ROUTES, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGE_SEO.contact);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Conversemos
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Contacto
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Correcciones, publicidad, prensa o una idea para {SITE_NAME}.
        Respondemos desde Santo Domingo.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <section className="rounded-2xl border border-edge bg-surface p-5 shadow-card sm:p-6 dark:shadow-none">
          <h2 className="font-heading text-lg font-semibold text-heading">
            Escribirnos
          </h2>
          <p className="mt-1 mb-6 text-sm text-muted">
            Nombre, correo, asunto y mensaje. No compartimos tu correo.
          </p>
          <ContactForm />
        </section>

        <aside className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Correo
            </h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-block font-semibold text-primary hover:underline dark:text-gold"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Redes
            </h2>
            <ul className="mt-2 space-y-2 text-sm">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.network}>
                  {social.href && social.href !== "#" ? (
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-heading hover:underline"
                    >
                      {social.label}
                    </a>
                  ) : (
                    <span className="text-muted">
                      {social.label} · pronto
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-muted">
            También puedes leer la{" "}
            <Link href={ROUTES.privacy} className="font-semibold text-primary hover:underline dark:text-gold">
              política de privacidad
            </Link>{" "}
            o{" "}
            <Link href={ROUTES.about} className="font-semibold text-primary hover:underline dark:text-gold">
              quiénes somos
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
