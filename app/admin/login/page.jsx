"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo iniciar sesión.");

      const next = searchParams.get("from");
      router.replace(next?.startsWith("/admin") ? next : "/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-4 rounded-xl border border-edge bg-surface p-6 shadow-card"
    >
      <div>
        <h1 className="font-heading text-2xl font-semibold text-heading">RD Al Día</h1>
        <p className="mt-1 text-sm text-muted">Acceso de administración</p>
      </div>

      <label className="block text-sm">
        Usuario
        <input
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
        />
      </label>

      <label className="block text-sm">
        Contraseña
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
        />
      </label>

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
