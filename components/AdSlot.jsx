"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  adsEnabled,
  getAdsenseClient,
  getAdSize,
  getAdSlot,
  isConfiguredAdSlot,
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
  slotId: slotIdProp,
  format: formatProp,
  layout: layoutProp,
  size = "rectangle",
  position,
  fallbackContent,
  lazy = true,
  className = "",
}) {
  const spec = getAdSize(size);
  const catalog = position ? getAdSlot(position) : null;
  const slotId = slotIdProp || catalog?.slotId || "";
  const format = formatProp || spec.adsenseFormat || "auto";
  const layout = layoutProp || spec.layout;
  const client = getAdsenseClient();
  const live = adsEnabled() && isConfiguredAdSlot(slotId);
  const hostRef = useRef(null);
  const insRef = useRef(null);
  const pushed = useRef(false);
  const [visible, setVisible] = useState(!lazy);
  const [failed, setFailed] = useState(false);

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
      setFailed(true);
    }
  }, [visible, live, client]);

  useEffect(() => {
    if (!visible || !live) return undefined;
    const node = insRef.current;
    if (!node) return undefined;

    const check = () => {
      if (node.getAttribute("data-ad-status") === "unfilled") {
        setFailed(true);
      }
    };

    const observer = new MutationObserver(check);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });
    const timeout = window.setTimeout(check, 8000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [visible, live]);

  if (failed) return null;

  return (
    <aside
      ref={hostRef}
      className={`mx-auto overflow-hidden rounded-md border border-dashed border-edge bg-surface/80 ${className}`}
      style={{
        width: spec.width,
        maxWidth: "100%",
        minHeight: spec.height,
      }}
      aria-label="Publicidad"
      data-ad-position={position || spec.key}
      data-ad-size={spec.key}
    >
      {!visible ? (
        <div className="h-full w-full animate-pulse bg-edge/50" style={{ minHeight: spec.height }} />
      ) : live ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", minHeight: spec.height }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-ad-layout={layout || undefined}
          data-full-width-responsive="true"
        />
      ) : (
        <Placeholder size={spec} fallbackContent={fallbackContent} />
      )}
    </aside>
  );
}
