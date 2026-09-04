import type { ReactNode } from "react";

export default function RelatedLinks(props: {
  title?: string;
  headingLevel?: "h2" | "h3";
  links?: Array<{ href: string; label: string; kind?: string }>;
}): ReactNode;
