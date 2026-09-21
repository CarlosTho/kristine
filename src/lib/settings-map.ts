export function withSiteCopy(row: {
  portrait_path: string | null;
  display_name: string;
  tagline: string;
  bio: string;
  updated_at: string;
  id: number;
  hero_kicker?: string | null;
  hero_headline?: string | null;
  hero_highlight?: string | null;
  footer_text?: string | null;
}) {
  const pick = (key: keyof typeof row, fallback: string) => {
    const value = row[key];
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  };

  return {
    id: row.id,
    displayName: row.display_name,
    tagline: row.tagline,
    bio: row.bio,
    portraitPath: row.portrait_path,
    welcomeLine: pick("hero_kicker", "Welcome to my blog"),
    titleLine: pick("hero_headline", "Notes from my law journey."),
    accentWord: pick("hero_highlight", "law journey"),
    closingNote: pick(
      "footer_text",
      "This is a record of my law journey. I also like to write about many things :)",
    ),
    updatedAt: new Date(row.updated_at),
  };
}

export function settingsColumns(input: {
  displayName: string;
  tagline: string;
  bio: string;
  portraitPath: string | null;
  welcomeLine: string;
  titleLine: string;
  accentWord: string;
  closingNote: string;
}) {
  return {
    display_name: input.displayName,
    tagline: input.tagline,
    bio: input.bio,
    portrait_path: input.portraitPath,
    hero_kicker: input.welcomeLine,
    hero_headline: input.titleLine,
    hero_highlight: input.accentWord,
    footer_text: input.closingNote,
    updated_at: new Date().toISOString(),
  };
}

