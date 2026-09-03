import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
