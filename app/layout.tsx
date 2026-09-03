import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Layout from "@/components/layout/Layout";
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

export const metadata: Metadata = {
  title: {
    default: "RD Al Día",
    template: "%s | RD Al Día",
  },
  description:
    "Hub diario de información para la República Dominicana: noticias, combustible, dólar, deportes, turismo y cultura.",
};

const themeInit = `(function(){try{var s=localStorage.getItem("rd-theme");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-body">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
