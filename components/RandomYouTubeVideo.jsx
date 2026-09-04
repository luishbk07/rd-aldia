"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";

const CHANNEL_URL = "https://www.youtube.com/@rutadelinversorinteligente";

function pickRandom(videos, exceptId) {
  const pool = videos.filter((item) => item.videoId !== exceptId);
  const source = pool.length ? pool : videos;
  return source[Math.floor(Math.random() * source.length)];
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-edge bg-surface shadow-card">
      <div className="aspect-video animate-pulse bg-edge" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="h-4 w-3/4 animate-pulse rounded bg-edge" />
        <div className="h-9 w-36 animate-pulse rounded bg-edge" />
      </div>
    </div>
  );
}

export default function RandomYouTubeVideo() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(null);
  const [channelUrl, setChannelUrl] = useState(CHANNEL_URL);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/random-video");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "error");
      const list =
        Array.isArray(data.videos) && data.videos.length
          ? data.videos
          : data.videoId
            ? [
                {
                  videoId: data.videoId,
                  title: data.title,
                  thumbnail: data.thumbnail,
                },
              ]
            : [];
      if (!list.length) throw new Error("empty");
      setVideos(list);
      setChannelUrl(data.channelUrl || CHANNEL_URL);
      setCurrent(pickRandom(list));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function showAnother() {
    setCurrent((item) => pickRandom(videos, item?.videoId));
  }

  if (status === "loading") return <Skeleton />;

  if (status === "error" || !current) {
    return (
      <div className="rounded-2xl border border-edge bg-surface px-5 py-8 text-center shadow-card sm:px-6">
        <p className="text-sm text-muted">
          No se pudo cargar el video. Inténtalo de nuevo.
        </p>
        <Button variant="outline" className="mt-4" onClick={load}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-edge bg-surface shadow-card">
      <div className="relative aspect-video bg-black">
        <iframe
          key={current.videoId}
          src={`https://www.youtube.com/embed/${current.videoId}`}
          title={current.title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-heading">
          {current.title}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={showAnother}>
            Ver otro video
          </Button>
          <a
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-primary hover:underline dark:text-gold"
          >
            Canal: Ruta del Inversor Inteligente
          </a>
        </div>
      </div>
    </article>
  );
}
