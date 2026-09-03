"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { LastUpdated } from "./LastUpdated";

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

const EMPTY = {
  title: "",
  slug: "",
  category: "noticias",
  excerpt: "",
  content: "",
  featured: false,
};

export default function ArticleEditor({ articles, onChange }) {
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewSlug = useMemo(
    () => (slugTouched ? form.slug : slugify(form.title)),
    [form.slug, form.title, slugTouched],
  );

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: previewSlug,
          featured: Boolean(form.featured),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al guardar.");
      onChange([data.article, ...articles]);
      setForm(EMPTY);
      setSlugTouched(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-edge bg-surface p-6">
      <h2 className="font-heading text-lg font-semibold text-heading">Nuevo artículo</h2>
      <p className="mt-1 text-sm text-muted">Texto plano. El HTML no se interpreta.</p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <label className="block text-sm">
          Título
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="block text-sm">
          Slug
          <input
            required
            value={previewSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setForm((current) => ({ ...current, slug: event.target.value }));
            }}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="block text-sm">
          Categoría
          <select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          >
            <option value="noticias">Noticias</option>
            <option value="nacionales">Nacionales</option>
            <option value="cultura">Cultura</option>
            <option value="turismo">Turismo</option>
            <option value="deportes">Deportes</option>
            <option value="opinion">Opinión</option>
          </select>
        </label>
        <label className="block text-sm">
          Extracto
          <textarea
            required
            rows={3}
            value={form.excerpt}
            onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
            className="mt-1 w-full rounded-md border border-edge bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Contenido
          <textarea
            required
            rows={8}
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            className="mt-1 w-full rounded-md border border-edge bg-background px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              setForm((current) => ({ ...current, featured: event.target.checked }))
            }
          />
          Destacar en portada
        </label>
        <Button type="submit" variant="primary" disabled={saving}>
          Publicar artículo
        </Button>
      </form>

      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

      <ul className="mt-6 space-y-3">
        {articles.map((article) => (
          <li key={article.id} className="rounded-lg border border-edge px-4 py-3">
            <p className="text-sm font-medium text-heading">{article.title}</p>
            <p className="text-xs text-muted">/{article.slug}</p>
            <LastUpdated value={article.updatedAt} />
          </li>
        ))}
      </ul>
    </section>
  );
}
