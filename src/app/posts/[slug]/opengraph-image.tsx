import { ImageResponse } from "next/og";
import { getPublishedPostBySlug } from "@/lib/queries";

export const alt = "Kristine Huaman — Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = /^[a-z0-9-]{1,90}$/.test(slug) ? await getPublishedPostBySlug(slug) : null;
  const title = data?.post.title ?? "Note";
  const category = data?.post.category ?? "Blog";

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
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8a5a2b",
          }}
        >
          {category}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 48 : 64,
            lineHeight: 1.1,
            color: "#1c2430",
            fontFamily: "Georgia, serif",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#5c5348" }}>Kristine Huaman</div>
      </div>
    ),
    size,
  );
}
