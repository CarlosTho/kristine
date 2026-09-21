import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/sanitize";
import type { PostInput } from "@/lib/validation";
import { settingsColumns, withSiteCopy } from "@/lib/settings-map";

export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverPath: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SectionRecord = {
  id: string;
  postId: string;
  position: number;
  type: "heading" | "paragraph" | "quote" | "image";
  content: string;
  imagePath: string | null;
};

export type SettingsRecord = ReturnType<typeof withSiteCopy>;

type SettingsRow = {
  id: number;
  display_name: string;
  tagline: string;
  bio: string;
  portrait_path: string | null;
  updated_at: string;
  hero_kicker?: string | null;
  hero_headline?: string | null;
  hero_highlight?: string | null;
  footer_text?: string | null;
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_path: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type SectionRow = {
  id: string;
  post_id: string;
  position: number;
  type: string;
  content: string;
  image_path: string | null;
};

function fail(message: string, error?: { message: string } | null): never {
  throw new Error(error?.message ? `${message}: ${error.message}` : message);
}

function mapSettings(row: SettingsRow) {
  return withSiteCopy({ ...row });
}

function mapPost(row: PostRow): PostRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    coverPath: row.cover_path,
    published: row.published,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function mapSection(row: SectionRow): SectionRecord {
  return {
    id: row.id,
    postId: row.post_id,
    position: row.position,
    type: row.type as SectionRecord["type"],
    content: row.content,
    imagePath: row.image_path,
  };
}

export const getSettings = cache(async function getSettings(): Promise<SettingsRecord> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
  if (error) fail("Could not load site settings", error);
  if (!data) fail("Site settings are missing. Run supabase/schema.sql in the SQL Editor.");
  return mapSettings(data as SettingsRow);
});

export const listPublishedPosts = cache(async function listPublishedPosts(): Promise<PostRecord[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) fail("Could not load posts", error);
  return ((data ?? []) as PostRow[]).map(mapPost);
});

export async function listAllPosts(): Promise<PostRecord[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  if (error) fail("Could not load posts", error);
  return ((data ?? []) as PostRow[]).map(mapPost);
}

export const getPublishedPostBySlug = cache(async function getPublishedPostBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) fail("Could not load post", error);
  if (!data) return null;
  return { post: mapPost(data as PostRow), sections: await sectionsFor((data as PostRow).id) };
});

export async function getPostById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) fail("Could not load post", error);
  if (!data) return null;
  return { post: mapPost(data as PostRow), sections: await sectionsFor((data as PostRow).id) };
}

async function sectionsFor(postId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("post_id", postId)
    .order("position", { ascending: true });
  if (error) fail("Could not load sections", error);
  return (data as SectionRow[]).map(mapSection);
}

async function uniqueSlug(title: string, ignoreId?: string) {
  const supabase = await createSupabaseServerClient();
  const base = slugify(title);
  let candidate = base;
  let n = 2;

  while (n < 50) {
    const { data, error } = await supabase.from("posts").select("id").eq("slug", candidate).maybeSingle();
    if (error) fail("Could not check slug", error);
    if (!data || data.id === ignoreId) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
  fail("Could not create a unique path for this title");
}

export async function savePost(input: PostInput) {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const id = input.id ?? crypto.randomUUID();
  const slug = await uniqueSlug(input.title, input.id);

  const values = {
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    cover_path: input.coverPath,
    published: input.published,
    updated_at: now,
  };

  if (input.id) {
    const { error } = await supabase.from("posts").update(values).eq("id", id);
    if (error) fail("Could not update post", error);
  } else {
    const { error } = await supabase.from("posts").insert({ ...values, created_at: now });
    if (error) fail("Could not create post", error);
  }

  const sectionRows = input.sections.map((section, index) => ({
    id: crypto.randomUUID(),
    post_id: id,
    position: index,
    type: section.type,
    content: section.content,
    image_path: section.type === "image" ? section.imagePath : null,
  }));

  const { error: insertError } = await supabase.rpc("replace_post_sections", {
    p_post_id: id,
    p_sections: sectionRows,
  });
  if (insertError) fail("Could not save sections", insertError);

  return { id, slug };
}

export async function deletePost(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) fail("Could not delete post", error);
}

export async function updateSettings(input: {
  displayName: string;
  tagline: string;
  bio: string;
  portraitPath: string | null;
  welcomeLine: string;
  titleLine: string;
  accentWord: string;
  closingNote: string;
}) {
  const current = await getSettings();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("settings").update(settingsColumns(input)).eq("id", current.id);
  if (error) fail("Could not update profile", error);
}
