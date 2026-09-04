import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { sanityImageUrl } from "@/lib/sanity";

const components = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 font-heading text-2xl font-semibold text-heading">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-heading text-xl font-semibold text-heading">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-5 font-heading text-lg font-semibold text-heading">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-4 text-muted italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="font-semibold text-accent underline-offset-2 hover:underline"
        rel="noreferrer"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = sanityImageUrl(value, 1200);
      if (!src) return null;
      return (
        <figure className="relative my-6 aspect-video overflow-hidden rounded-xl bg-edge">
          <Image
            src={src}
            alt={value?.alt || "Imagen del artículo en RD Al Día"}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </figure>
      );
    },
  },
};

export default function PortableContent({ value }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
