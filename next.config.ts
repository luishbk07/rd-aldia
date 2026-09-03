import type { NextConfig } from "next";

/**
 * Netlify OpenNext (Next.js 16): keep the Node server.
 * Do not set `output: "export"` — that would drop SSR, Route Handlers,
 * and `/api/*`. Image optimization is handled by Netlify Image CDN
 * from these remotePatterns; no custom loader is required.
 */
const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  serverExternalPackages: ["rss-parser"],
  async redirects() {
    return [
      {
        source: "/combustible",
        destination: "/combustible-hoy",
        permanent: true,
      },
      { source: "/dolar", destination: "/dolar-rd", permanent: true },
      {
        source: "/deportes",
        destination: "/lidom-resultados",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
