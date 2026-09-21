import type { Metadata } from "next";
import type { SettingsRecord } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

export const LINKEDIN_URL = "https://www.linkedin.com/in/kristine-huaman/";

export const DEFAULT_DESCRIPTION =
  "Notes from Kristine Huaman on her law journey—study, internships, and writing from the path into the legal profession.";

export function pageAlternates(pathname: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: pathname,
    types: {
      "application/rss+xml": "/rss.xml",
    },
  };
}

export function clipDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function siteDescription(site: Pick<SettingsRecord, "tagline" | "titleLine">): string {
  const tagline = site.tagline.trim();
  if (tagline && !/^lorem ipsum/i.test(tagline)) {
    return clipDescription(tagline);
  }
  if (site.titleLine.trim() && site.titleLine !== "Notes from my law journey.") {
    return clipDescription(site.titleLine);
  }
  return DEFAULT_DESCRIPTION;
}

export function siteTitle(displayName: string): string {
  const name = displayName.trim() || "Kristine Huaman";
  return `${name} — Blog`;
}

export function rootMetadata(site: SettingsRecord): Metadata {
  const title = siteTitle(site.displayName);
  const description = siteDescription(site);
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s — ${site.displayName.trim() || "Kristine Huaman"}`,
    },
    description,
    applicationName: title,
    authors: [{ name: site.displayName, url: LINKEDIN_URL }],
    alternates: {
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    creator: site.displayName,
    publisher: site.displayName,
    keywords: ["Kristine Huaman", "law journey", "law school", "legal career", "blog"],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: title,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    category: "blog",
  };
}
