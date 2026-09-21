import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4efe6",
          color: "#1c2430",
          fontSize: 28,
          fontFamily: "Georgia, serif",
        }}
      >
        KH
      </div>
    ),
    size,
  );
}
