import { Badge, Card, SectionTitle } from "@/components/ui";

type SectionPlaceholderProps = {
  title: string;
  description: string;
};

export function SectionPlaceholder({
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionTitle eyebrow="Sección" as="h1">
        {title}
      </SectionTitle>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
        {description}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Próximamente", "Datos en vivo", "Archivo"].map((label) => (
          <Card key={label}>
            <Badge tone="gold">{label}</Badge>
            <p className="mt-3 font-heading text-sm font-semibold text-heading">
              {label}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Placeholder — contenido de {title.toLowerCase()} se conectará
              aquí.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
