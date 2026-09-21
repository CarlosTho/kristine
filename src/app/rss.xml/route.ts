import { listPublishedPosts, getSettings } from "@/lib/queries";
import { siteDescription, siteTitle } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [site, posts] = await Promise.all([getSettings(), listPublishedPosts()]);
  const origin = getSiteUrl();
  const title = escapeXml(siteTitle(site.displayName));
  const description = escapeXml(siteDescription(site));

  const items = posts
    .map((post) => {
      const link = `${origin}/posts/${post.slug}`;
      return `<item>
<title>${escapeXml(post.title)}</title>
<link>${link}</link>
<guid>${link}</guid>
<pubDate>${post.createdAt.toUTCString()}</pubDate>
<description>${escapeXml(post.excerpt || post.title)}</description>
<category>${escapeXml(post.category)}</category>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${title}</title>
<link>${origin}</link>
<description>${description}</description>
<language>en-us</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
