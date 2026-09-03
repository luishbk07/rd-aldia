import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = "RD Al Día — información diaria de República Dominicana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#003366",
          color: "#ffffff",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 8,
            width: "100%",
            background: "#C8102E",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#FFD700",
            }}
          >
            República Dominicana
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ marginTop: 20, fontSize: 32, color: "#d7e4f2" }}>
            Noticias, combustible, dólar y béisbol. Al día.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#9fb4c9" }}>
          rdaldia.com
        </div>
      </div>
    ),
    { ...size },
  );
}
