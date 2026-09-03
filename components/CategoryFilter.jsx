"use client";

export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar destinos">
      {categories.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground"
                : "bg-surface text-heading ring-1 ring-edge hover:bg-primary/8"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
