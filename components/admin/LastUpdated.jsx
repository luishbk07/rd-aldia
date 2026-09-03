export function LastUpdated({ value, saving }) {
  const label = value
    ? new Intl.DateTimeFormat("es-DO", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Sin guardar";

  return (
    <p className="text-xs text-muted" aria-live="polite">
      {saving ? "Guardando…" : `Última actualización: ${label}`}
    </p>
  );
}
