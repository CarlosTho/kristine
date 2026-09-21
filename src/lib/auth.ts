import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminEmail } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

type Session = { role: "admin"; email: string };

export async function readSession(): Promise<Session | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  if (data.user.email.toLowerCase() !== getAdminEmail()) return null;
  return { role: "admin", email: data.user.email };
}

export async function requireAdmin() {
  const session = await readSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function isAdmin() {
  return Boolean(await readSession());
}

async function clientKey() {
  const requestHeaders = await headers();
  const vercelForwarded = requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercelForwarded) return vercelForwarded;
  if (process.env.VERCEL) return "unknown";
  return requestHeaders.get("x-real-ip")?.split(",")[0]?.trim() || "local";
}

export async function login(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Check your email and password." };
  }

  const ipLimited = rateLimit(`login:ip:${await clientKey()}`, 5, 15 * 60 * 1000);
  const emailLimited = rateLimit(`login:email:${parsed.data.email}`, 5, 15 * 60 * 1000);
  if (!ipLimited.ok || !emailLimited.ok) {
    return { ok: false as const, error: "Too many attempts. Try again in a few minutes." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || data.user?.email?.toLowerCase() !== getAdminEmail()) {
    if (data.user) await supabase.auth.signOut();
    return { ok: false as const, error: "Invalid email or password." };
  }

  return { ok: true as const };
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
