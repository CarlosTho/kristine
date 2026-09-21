import { ImageResponse } from "next/og";

export const alt = "Kristine Huaman — Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f4efe6",
          padding: "72px 80px",
          borderLeft: "14px solid #c43e3e",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8a5a2b",
          }}
        >
          Welcome to my blog
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            lineHeight: 1.05,
            color: "#1c2430",
            fontFamily: "Georgia, serif",
          }}
        >
          Notes from a law journey.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5c5348" }}>Kristine Huaman</div>
      </div>
    ),
    size,
  );
}
