"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  adsEnabled,
  getAdsenseClient,
  getAdSize,
  getAdSlot,
  loadAdsenseScript,
} from "@/lib/ads";
import { ROUTES } from "@/lib/site";

function Placeholder({ size, fallbackContent }) {
  if (fallbackContent) return fallbackContent;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
        Publicidad
      </p>
      <p className="font-heading text-sm font-semibold text-heading">
        {size.label} · {size.width}×{size.height}
      </p>
      <Link
        href={ROUTES.advertise}
        className="text-xs font-semibold text-accent hover:underline"
      >
        Anúnciate con nosotros
      </Link>
    </div>
  );
}

export default function AdSlot({
  size = "rectangle",
  position,
  fallbackContent,
  lazy = true,
  className = "",
}) {
  const spec = getAdSize(size);
  const slot = position ? getAdSlot(position) : null;
  const slotId = slot?.slotId;
  const client = getAdsenseClient();
  const live = adsEnabled() && Boolean(slotId);
  const hostRef = useRef(null);
  const pushed = useRef(false);
  const [visible, setVisible] = useState(!lazy);

  useEffect(() => {
    if (!lazy || visible) return undefined;
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [lazy, visible]);

  useEffect(() => {
    if (!visible || !live || pushed.current) return;
    loadAdsenseScript(client);
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      /* AdSense not ready */
    }
  }, [visible, live, client]);

  return (
    <aside
      ref={hostRef}
      className={`mx-auto overflow-hidden rounded-md border border-dashed border-edge bg-surface/80 ${className}`}
      style={{
        width: spec.width,
        height: spec.height,
        maxWidth: "100%",
      }}
      aria-label="Publicidad"
      data-ad-position={position || spec.key}
      data-ad-size={spec.key}
    >
      {!visible ? (
        <div className="h-full w-full animate-pulse bg-edge/50" />
      ) : live ? (
        <ins
          className="adsbygoogle"
          style={{
            display: "inline-block",
            width: spec.width,
            height: spec.height,
          }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format={spec.adsenseFormat}
          data-full-width-responsive="false"
        />
      ) : (
        <Placeholder size={spec} fallbackContent={fallbackContent} />
      )}
    </aside>
  );
}
