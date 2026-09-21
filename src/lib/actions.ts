"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, login, logout } from "@/lib/auth";
import { postInputSchema, profileSchema, heroCopySchema, footerCopySchema } from "@/lib/validation";
import { deletePost, getSettings, savePost, updateSettings } from "@/lib/queries";
import { saveImageUpload } from "@/lib/uploads";

function revalidatePublic(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  if (slug) revalidatePath(`/posts/${slug}`);
}

export async function loginAction(
  _prev: { ok: false; error: string } | null,
  formData: FormData,
) {
  const result = await login({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!result.ok) {
    return result;
  }

  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

async function assertAdmin() {
  if (!(await isAdmin())) {
    return { ok: false as const, error: "Please sign in again." };
  }
  return null;
}

export async function savePostAction(input: unknown) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const parsed = postInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the post and try again." };
  }

  try {
    const saved = await savePost(parsed.data);
    revalidatePublic(saved.slug);
    revalidatePath("/admin");
    return { ok: true as const, id: saved.id, slug: saved.slug };
  } catch {
    return { ok: false as const, error: "Could not save the post." };
  }
}

export async function deletePostAction(postId: string) {
  const denied = await assertAdmin();
  if (denied) return denied;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)) {
    return { ok: false as const, error: "Invalid post." };
  }
  try {
    await deletePost(postId);
    revalidatePublic();
    revalidatePath("/admin");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not delete the post." };
  }
}

export async function uploadImageAction(formData: FormData) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const file = formData.get("file");
  const kind = formData.get("kind");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "Choose an image." };
  }
  if (kind !== "cover" && kind !== "section" && kind !== "portrait") {
    return { ok: false as const, error: "Invalid upload." };
  }

  try {
    const path = await saveImageUpload(file, kind);
    return { ok: true as const, path };
  } catch (error) {
    if (error instanceof Error && error.message === "Images must be 3MB or smaller.") {
      return { ok: false as const, error: error.message };
    }
    if (error instanceof Error && error.message === "Use a JPG, PNG, or WEBP image.") {
      return { ok: false as const, error: error.message };
    }
    if (error instanceof Error && error.message === "Choose an image to upload.") {
      return { ok: false as const, error: error.message };
    }
    return { ok: false as const, error: "Upload failed." };
  }
}

export async function saveProfileAction(input: unknown) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the profile and try again." };
  }
  try {
    await updateSettings(parsed.data);
    revalidatePublic();
    revalidatePath("/admin");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not save the profile." };
  }
}

export async function saveHeroCopyAction(input: unknown) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const parsed = heroCopySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the text and try again." };
  }
  try {
    const current = await getSettings();
    await updateSettings({
      displayName: current.displayName,
      bio: current.bio,
      portraitPath: current.portraitPath,
      closingNote: current.closingNote,
      ...parsed.data,
    });
    revalidatePublic();
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not save." };
  }
}

export async function saveFooterCopyAction(input: unknown) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const parsed = footerCopySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the text and try again." };
  }
  try {
    const current = await getSettings();
    await updateSettings({
      displayName: current.displayName,
      tagline: current.tagline,
      bio: current.bio,
      portraitPath: current.portraitPath,
      welcomeLine: current.welcomeLine,
      titleLine: current.titleLine,
      accentWord: current.accentWord,
      closingNote: parsed.data.closingNote,
    });
    revalidatePublic();
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not save." };
  }
}
