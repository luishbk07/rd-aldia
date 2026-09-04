import Link from "next/link";

export default function RelatedLinks({
  title = "También te puede interesar",
  links = [],
  headingLevel = "h2",
}) {
  if (!links.length) return null;

  const Heading = headingLevel === "h3" ? "h3" : "h2";

  return (
    <nav
      aria-label={title}
      className="mt-12 rounded-xl border border-edge bg-surface px-5 py-6"
    >
      <Heading className="font-heading text-lg font-semibold text-heading">
        {title}
      </Heading>
      <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-semibold text-primary hover:underline dark:text-gold"
            >
              {link.kind ? `${link.kind}: ${link.label}` : link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
