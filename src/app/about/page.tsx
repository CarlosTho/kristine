import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Portrait } from "@/components/portrait";
import { SiteShell } from "@/components/site-shell";
import { getSettings } from "@/lib/queries";
import { clipDescription, pageAlternates } from "@/lib/seo";
import { aboutPageGraph } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSettings();
  const description = site.bio.trim()
    ? clipDescription(site.bio)
    : site.tagline.trim() && !/^lorem ipsum/i.test(site.tagline)
      ? clipDescription(site.tagline)
      : `About ${site.displayName} — a law journey in notes, study, and internships.`;

  return {
    title: "About",
    description,
    alternates: pageAlternates("/about"),
    openGraph: {
      title: `About ${site.displayName}`,
      description,
      type: "profile",
    },
  };
}

export default async function AboutPage() {
  const site = await getSettings();

  return (
    <>
      <JsonLd data={aboutPageGraph(site)} />
      <SiteShell className="grid items-start gap-8 py-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:py-12">
      <div className="rise relative mx-auto w-full max-w-[16rem] lg:mx-0 lg:max-w-md">
        <div
          aria-hidden="true"
          className="absolute inset-[0.85rem_-0.55rem_-0.85rem_0.55rem] rotate-2 rounded-[1.2rem] bg-[var(--brass)] lg:inset-[1.1rem_-0.9rem_-1.1rem_0.9rem] lg:rounded-[1.35rem]"
        />
        <Portrait
          src={site.portraitPath}
          name={site.displayName}
          className="relative aspect-[4/5] w-full lg:-rotate-1"
        />
      </div>
      <article className="rise rise-2 paper-card max-w-2xl rounded-2xl p-5 md:rounded-3xl md:p-8">
        <p className="kicker">On the record</p>
        <h1 className="mt-3 font-display text-4xl leading-[0.95] italic md:text-5xl">{site.displayName}</h1>
        <p className="mt-4 text-base text-[var(--muted)] md:text-xl">{site.tagline}</p>
        <div className="mt-5 space-y-5 text-base leading-7 whitespace-pre-wrap md:mt-6 md:text-lg md:leading-8">{site.bio}</div>
      </article>
    </SiteShell>
    </>
  );
}
