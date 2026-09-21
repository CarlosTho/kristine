import type { Metadata } from "next";
import { HeroCopy } from "@/components/hero-copy";
import { Portrait } from "@/components/portrait";
import { PostCard } from "@/components/post-card";
import { SiteShell } from "@/components/site-shell";
import { isAdmin } from "@/lib/auth";
import { getSettings, listPublishedPosts } from "@/lib/queries";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: pageAlternates("/"),
  };
}

export default async function HomePage() {
  const site = await getSettings();
  const posts = await listPublishedPosts();
  const [featured, ...rest] = posts;
  const admin = await isAdmin();

  return (
    <SiteShell className="pt-8 pb-10 md:pt-10 md:pb-12">
      <section className="grid min-w-0 items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)] md:gap-8">
        <div className="order-2 md:order-1">
          <HeroCopy
            isAdmin={admin}
            welcomeLine={site.welcomeLine}
            titleLine={site.titleLine}
            accentWord={site.accentWord}
            tagline={site.tagline}
          />
          <div className="rise rise-4 mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-7">
            <a
              href="/Kristine_Huaman_Resume.pdf"
              className="btn btn-primary rounded-full px-5 py-3 !text-white"
            >
              Here’s my resume :) →
            </a>
            <a
              href="https://www.linkedin.com/in/kristine-huaman/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost rounded-full px-5 py-3"
            >
              LinkedIn
            </a>
          </div>
          <p className="rise rise-4 mt-5 max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg">
            Click{" "}
            <a href="/about" className="about-here font-medium text-[#2f6f8f] underline decoration-[#2f6f8f] underline-offset-4">
              here
            </a>{" "}
            to learn a little more about me!
          </p>
        </div>
        <div className="order-1 mx-auto w-full min-w-0 max-w-[13.5rem] sm:max-w-xs md:order-2 md:max-w-sm">
          <Portrait
            src={site.portraitPath}
            name={site.displayName}
            className="relative aspect-[4/5] w-full"
          />
        </div>
      </section>

      <section id="notes" className="mt-16 min-w-0 scroll-mt-28 md:mt-28 md:scroll-mt-32">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-[var(--line)] pb-3 md:mb-8 md:pb-4">
          <h2 className="title-ink font-display text-3xl italic md:text-4xl">My blog</h2>
          <p className="text-xs tracking-[0.14em] uppercase text-[var(--muted)] md:text-sm">
            {String(posts.length).padStart(2, "0")} posts
          </p>
        </div>
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-[var(--muted)] md:p-10">
            Nothing published yet.
          </p>
        ) : (
          <div className="grid min-w-0 gap-6 md:gap-8">
            {featured ? <PostCard post={featured} index={0} variant="feature" /> : null}
            <div className="grid gap-4 md:gap-5">
              {rest.map((post, index) => (
                <PostCard key={post.id} post={post} index={index + 1} variant="list" />
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
