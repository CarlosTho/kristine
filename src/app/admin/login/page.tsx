import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isAdmin } from "@/lib/auth";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <SiteShell className="py-10 md:py-16">
      <div className="paper-card max-w-md rounded-2xl p-5 md:rounded-3xl md:p-8">
        <p className="kicker">Studio</p>
        <h1 className="mt-3 font-display text-4xl">Sign in</h1>
        <p className="mt-3 text-[var(--muted)]">
          Made for: Kristine-Huaman (my lovely gf) &lt;3
        </p>
        <LoginForm />
      </div>
    </SiteShell>
  );
}
