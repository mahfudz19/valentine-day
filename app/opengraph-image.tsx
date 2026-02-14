import { ImageResponse } from "next/og";

export const runtime = "edge";

// Metadata gambar
export const alt = "Be My Valentine?";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "linear-gradient(to bottom right, #fff1f2, #ffe4e6)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", marginBottom: 40 }}>🌹</div>
      <div
        style={{
          fontSize: 60,
          fontWeight: "bold",
          color: "#e11d48",
          marginTop: 20,
        }}
      >
        Be My Valentine?
      </div>
    </div>,
    {
      ...size,
    },
  );
}
