import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0d9488",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          boxSizing: "border-box",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 40,
            fontWeight: 500,
            lineHeight: 1.4,
            textAlign: "center",
            opacity: 0.95,
          }}
        >
          Membangun Masjid dan Ruang Kelas/Asrama untuk Generasi Berilmu dan Berakhlak
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
