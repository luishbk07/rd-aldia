import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import Analytics from "@/components/seo/Analytics";
import JsonLd from "@/components/seo/JsonLd";
import Layout from "@/components/layout/Layout";
import { adsEnabled, getAdsenseClient } from "@/lib/ads";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/metadata";
import { CORE_KEYWORDS, DEFAULT_DESCRIPTION, PAGE_SEO } from "@/lib/seo/pages";
import { siteGraphSchema } from "@/lib/seo/schema";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const home = PAGE_SEO.home;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${home.title} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...CORE_KEYWORDS, ...home.keywords],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "news",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: SITE_NAME,
    title: `${home.title} | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${home.title} | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const themeInit = `(function(){try{var s=localStorage.getItem("rd-theme");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-DO"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col font-body"
        suppressHydrationWarning
      >
        <Script id="rd-theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        {adsEnabled() ? (
          <Script
            id="rd-adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getAdsenseClient()}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        ) : null}
        <JsonLd data={siteGraphSchema()} />
        <Analytics />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
