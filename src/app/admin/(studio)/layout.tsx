import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <div className="border-b border-[var(--line)] bg-[var(--navy)] text-[var(--cream)]">
        <SiteShell className="flex flex-col gap-3 py-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="btn rounded-full border border-white/30 px-4 py-2 text-xs no-underline"
            >
              ← Blog
            </Link>
            <p className="tracking-[0.18em] uppercase text-xs opacity-80">Studio</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-4">
            <Link href="/admin" className="no-underline opacity-90 hover:opacity-100">
              Posts
            </Link>
            <Link href="/admin/posts/new" className="no-underline opacity-90 hover:opacity-100">
              New note
            </Link>
            <Link href="/admin/profile" className="no-underline opacity-90 hover:opacity-100">
              Profile
            </Link>
            <form action={logoutAction}>
              <button className="btn rounded-full border border-white/20 px-3 py-1 text-xs">
                Sign out
              </button>
            </form>
          </nav>
        </SiteShell>
      </div>
      {children}
    </div>
  );
}
