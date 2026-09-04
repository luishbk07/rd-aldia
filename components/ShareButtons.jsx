"use client";

import { useEffect, useMemo, useState } from "react";
import { buildSharePayload, shareNetworkUrls } from "@/lib/seo/share";
import { SITE_NAME } from "@/lib/site";

const NETWORKS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    className: "bg-[#25D366] hover:bg-[#1ebe57] hover:shadow-[#25D366]/35",
    icon: WhatsAppIcon,
  },
  {
    id: "facebook",
    label: "Facebook",
    className: "bg-[#1877F2] hover:bg-[#0f6ae6] hover:shadow-[#1877F2]/35",
    icon: FacebookIcon,
  },
  {
    id: "x",
    label: "X",
    className: "bg-black hover:bg-neutral-800 hover:shadow-black/30 dark:bg-neutral-950",
    icon: XIcon,
  },
  {
    id: "telegram",
    label: "Telegram",
    className: "bg-[#229ED9] hover:bg-[#1b8dc4] hover:shadow-[#229ED9]/35",
    icon: TelegramIcon,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    className: "bg-[#0A66C2] hover:bg-[#0958a8] hover:shadow-[#0A66C2]/35",
    icon: LinkedInIcon,
  },
];

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.5 3.5A11 11 0 0 0 3.2 17.3L2 22l4.8-1.2A11 11 0 1 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.7-1.3l-.3-.2-2.9.8.8-2.8-.2-.3A9.2 9.2 0 1 1 12 20.5Zm5.1-6.9c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.6 7.6 0 0 1-2.2-1.4 8.3 8.3 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.3-.4.2-.3c.1-.2 0-.3 0-.5l-.9-2.1c-.2-.6-.5-.5-.6-.5h-.5c-.2 0-.5.1-.7.3a2.6 2.6 0 0 0-.8 2c0 1.2.9 2.3 1 2.5a9.5 9.5 0 0 0 3.6 3.3 12 12 0 0 0 2 .9 4.8 4.8 0 0 0 2.2.2 3.6 3.6 0 0 0 2.4-1.7 3 3 0 0 0 .2-1.7c-.1-.1-.3-.2-.6-.3Z"
      />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.1-1.1 1.2-1.1H17V3h-2.3C11.8 3 11 4.6 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.4l.3-2.7h-2.7Z"
      />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.7 10.3 21 3h-1.8l-5.3 6.1L9.5 3H3.2l6.6 9.6L3.2 21h1.8l5.9-6.8L14.4 21h6.3l-6-10.7Zm-2.1 2.4-.7-1-5.5-7.8h2.4l4.4 6.3.7 1 5.7 8.2h-2.4l-4.6-6.7Z"
      />
    </svg>
  );
}

function TelegramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.5 4.4 2.8 11.6c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8 1 .8.5 0 .7-.2 1-.6l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-.9l3.3-15.6c.3-1.3-.5-1.9-1.3-1.4ZM8.4 14.2l10.3-6.5c.5-.3 1-.1.6.2l-8.8 8-.3 3.5-1.8-5.2Z"
      />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 9.3H4V20h2.5V9.3ZM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4ZM20 20h-2.5v-5.7c0-1.6-.6-2.4-1.8-2.4-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V20H11.4s0-9.3 0-10.7H14v1.7c.5-.8 1.5-2 3.6-2 2.5 0 4.4 1.6 4.4 5.2V20Z"
      />
    </svg>
  );
}

function ShareRow({ title, links, size = "md" }) {
  const buttonSize = size === "sm" ? "size-9" : "size-10";
  const iconSize = size === "sm" ? "size-4" : "size-[1.15rem]";

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {NETWORKS.map((network) => {
        const Icon = network.icon;
        return (
          <li key={network.id}>
            <a
              href={links[network.id]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Compartir «${title}» en ${network.label}`}
              className={`inline-flex ${buttonSize} items-center justify-center rounded-full text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${network.className}`}
            >
              <Icon className={iconSize} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function ShareButtons({
  title,
  path,
  url,
  hash,
  label = "Compartir",
  variant = "inline",
  compact = false,
  className = "",
}) {
  const [liveUrl, setLiveUrl] = useState(() => buildSharePayload({ title, path, url, hash }).url);

  useEffect(() => {
    const next = buildSharePayload({ title, path, url, hash }).url;
    if (next) {
      setLiveUrl(next);
      return;
    }
    setLiveUrl(window.location.href.split("#")[0] + (hash ? `#${hash}` : ""));
  }, [title, path, url, hash]);

  const shareTitle = title || SITE_NAME;
  const links = useMemo(
    () => shareNetworkUrls({ title: shareTitle, url: liveUrl }),
    [shareTitle, liveUrl],
  );

  const showInline = variant === "inline" || variant === "both";
  const showFloating = variant === "floating" || variant === "both";

  return (
    <>
      {showInline ? (
        <div className={className}>
          {label ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {label}
            </p>
          ) : null}
          <ShareRow title={shareTitle} links={links} size={compact ? "sm" : "md"} />
        </div>
      ) : null}

      {showFloating ? (
        <>
          <div className="h-16 md:hidden" aria-hidden="true" />
          <nav
            aria-label="Compartir en redes"
            className="fixed bottom-3 left-1/2 z-40 flex max-w-[calc(100vw-1.25rem)] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-full border border-edge bg-surface/95 px-3 py-2 shadow-card backdrop-blur-md md:hidden"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            <span className="hidden pr-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted min-[380px]:inline">
              Compartir
            </span>
            <ShareRow title={shareTitle} links={links} size="sm" />
          </nav>
        </>
      ) : null}
    </>
  );
}
