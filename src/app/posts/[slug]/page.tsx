import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ReadingProgress } from "@/components/reading-progress";
import { SiteShell } from "@/components/site-shell";
import { getPublishedPostBySlug, getSettings, listPublishedPosts } from "@/lib/queries";
import { pageAlternates } from "@/lib/seo";
import { blogPostingGraph, breadcrumbGraph } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,90}$/.test(slug)) {
    return { title: "Note", robots: { index: false, follow: false } };
  }
  const data = await getPublishedPostBySlug(slug);
  if (!data) return { title: "Note", robots: { index: false, follow: false } };

  const description = data.post.excerpt.trim() || data.post.title;
  return {
    title: data.post.title,
    description,
    keywords: [data.post.category, "Kristine Huaman", "law journey"],
    alternates: pageAlternates(`/posts/${data.post.slug}`),
    openGraph: {
      type: "article",
      title: data.post.title,
      description,
      publishedTime: data.post.createdAt.toISOString(),
      modifiedTime: data.post.updatedAt.toISOString(),
      section: data.post.category,
      images: [{ url: `/posts/${data.post.slug}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.post.title,
      description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,90}$/.test(slug)) notFound();

  const data = await getPublishedPostBySlug(slug);
  if (!data) notFound();
  const [site, posts] = await Promise.all([getSettings(), listPublishedPosts()]);
  const related = posts.filter((post) => post.slug !== data.post.slug).slice(0, 3);
  const published = data.post.createdAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const firstParagraphId = data.sections.find((section) => section.type === "paragraph")?.id;

  return (
    <>
      <JsonLd data={blogPostingGraph(site, data.post)} />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Blog", path: "/" },
          { name: data.post.title, path: `/posts/${data.post.slug}` },
        ])}
      />
      <ReadingProgress />
      <SiteShell as="article" className="max-w-3xl py-8 md:py-12">
        <Link href="/" className="nav-link rise inline-block">
          ← Blog
        </Link>
        <div className="note-meta rise rise-2 mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-[0.14em] uppercase text-[var(--muted)] md:mt-8">
          <span>{data.post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{published}</span>
        </div>
        <h1 className="rise rise-2 mt-5 max-w-[18ch] font-display text-4xl leading-[0.95] italic md:mt-6 md:text-7xl md:leading-[0.9]">
          {data.post.title}
        </h1>
        <p className="rise rise-3 mt-5 border-l-2 border-[var(--brass)] pl-4 text-base italic leading-7 text-[var(--muted)] md:text-lg md:leading-8">
          {data.post.excerpt}
        </p>
        {data.post.coverPath ? (
          <div className="post-photo media-frame rise rise-4 mt-8 rounded-2xl md:-rotate-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.post.coverPath} alt={`Cover for ${data.post.title}`} />
          </div>
        ) : null}
        <div className="mt-8 space-y-7 md:mt-12">
          {data.sections.map((section) => {
            if (section.type === "heading") {
              return (
                <h2 key={section.id} className="pt-4 font-display text-2xl italic md:text-3xl">
                  {section.content}
                </h2>
              );
            }
            if (section.type === "quote") {
              return (
                <blockquote
                  key={section.id}
                  className="quote-block relative bg-[var(--navy)] px-4 py-6 font-display text-xl leading-snug text-[var(--cream)] md:px-6 md:py-7 md:text-2xl"
                >
                  <span className="absolute -top-3 left-5 font-display text-5xl italic text-[var(--brass)]">
                    “
                  </span>
                  {section.content}
                </blockquote>
              );
            }
            if (section.type === "image" && section.imagePath) {
              return (
                <figure key={section.id} className="grid gap-2">
                  <div className="post-photo media-frame overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={section.imagePath} alt={section.content || ""} />
                  </div>
                  {section.content ? (
                    <figcaption className="text-center text-sm italic text-[var(--muted)]">
                      {section.content}
                    </figcaption>
                  ) : null}
                </figure>
              );
            }
            const drop = section.id === firstParagraphId;
            return (
              <p
                key={section.id}
                className={
                  drop
                    ? "text-base leading-7 whitespace-pre-wrap first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-5xl first-letter:leading-[0.75] first-letter:text-[var(--brass-deep)] md:text-lg md:leading-8 md:first-letter:text-7xl"
                    : "text-base leading-7 whitespace-pre-wrap md:text-lg md:leading-8"
                }
              >
                {section.content}
              </p>
            );
          })}
        </div>
        {related.length > 0 ? (
          <nav aria-label="More notes" className="mt-14 border-t border-[var(--line)] pt-8 md:mt-16">
            <p className="kicker">More notes</p>
            <ul className="mt-4 grid gap-3">
              {related.map((post) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.slug}`} className="nav-link font-display text-xl italic md:text-2xl">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs tracking-[0.14em] uppercase text-[var(--muted)]">{post.category}</p>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </SiteShell>
    </>
  );
}
