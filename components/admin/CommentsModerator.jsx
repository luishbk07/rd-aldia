"use client";

import { useState } from "react";
import { LastUpdated } from "./LastUpdated";

export default function CommentsModerator({ comments, onChange }) {
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");

  async function patch(comment, next) {
    setPendingId(comment.id);
    setError("");

    try {
      const response = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id, ...next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al guardar.");
      onChange(comments.map((item) => (item.id === comment.id ? data.comment : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setPendingId("");
    }
  }

  return (
    <section className="rounded-xl border border-edge bg-surface p-6">
      <h2 className="font-heading text-lg font-semibold text-heading">Comentarios</h2>
      <p className="mt-1 text-sm text-muted">Aprueba o destaca. Los cambios se guardan al instante.</p>

      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

      <ul className="mt-5 space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-lg border border-edge px-4 py-3">
            <p className="text-sm font-medium text-heading">{comment.authorName}</p>
            <p className="mt-1 text-sm text-foreground">{comment.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={comment.approved}
                  disabled={pendingId === comment.id}
                  onChange={(event) =>
                    patch(comment, { approved: event.target.checked, featured: comment.featured })
                  }
                />
                Aprobado
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={comment.featured}
                  disabled={pendingId === comment.id}
                  onChange={(event) =>
                    patch(comment, { approved: comment.approved, featured: event.target.checked })
                  }
                />
                Destacado
              </label>
              <LastUpdated value={comment.updatedAt} saving={pendingId === comment.id} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
