const HTML_TAG = /<[^>]*>/g;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

export function asPlainText(value: string, max = 20_000): string {
  return value
    .replace(HTML_TAG, "")
    .replace(CONTROL_CHARS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function asMultilineText(value: string, max = 20_000): string {
  return value
    .replace(HTML_TAG, "")
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, max);
}

export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return base || "note";
}

export function isSafeUploadPath(value: string | null | undefined): boolean {
  if (!value) return false;
  const local = /^\/uploads\/(?:cover|section|portrait)-[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/;
  if (local.test(value)) return true;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const allowedHost = (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
      } catch {
        return "";
      }
    })();
    if (!allowedHost || url.hostname !== allowedHost) return false;
    return /\/storage\/v1\/object\/public\/media\/(?:cover|section|portrait)-[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/.test(
      url.pathname,
    );
  } catch {
    return false;
  }
}
