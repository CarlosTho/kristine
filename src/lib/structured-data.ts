import type { PostRecord, SettingsRecord } from "@/lib/queries";
import { LINKEDIN_URL, siteDescription, siteTitle } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export function personId() {
  return `${getSiteUrl()}/#person`;
}

export function websiteGraph(site: SettingsRecord) {
  const url = getSiteUrl();
  const name = siteTitle(site.displayName);
  const description = siteDescription(site);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name,
        description,
        inLanguage: "en-US",
        publisher: { "@id": personId() },
      },
      {
        "@type": "Person",
        "@id": personId(),
        name: site.displayName,
        url: `${url}/about`,
        sameAs: [LINKEDIN_URL],
        description,
      },
    ],
  };
}

export function aboutPageGraph(site: SettingsRecord) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${url}/about`,
    name: `About ${site.displayName}`,
    description: siteDescription(site),
    mainEntity: { "@id": personId() },
  };
}

export function blogPostingGraph(site: SettingsRecord, post: PostRecord) {
  const url = getSiteUrl();
  const page = `${url}/posts/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "en-US",
    articleSection: post.category,
    url: page,
    mainEntityOfPage: page,
    author: { "@id": personId(), name: site.displayName },
    publisher: { "@id": personId(), name: site.displayName },
    image: post.coverPath || undefined,
    isPartOf: { "@id": `${url}/#website` },
  };
}

export function breadcrumbGraph(items: { name: string; path: string }[]) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}
