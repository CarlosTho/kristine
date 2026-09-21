import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

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
        <div className="site-shell ml-[3.75rem] mr-4 w-[min(1120px,calc(100%-4.75rem))] md:ml-[5.75rem] md:mr-8 md:w-[min(1120px,calc(100%-7.75rem))] flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
          <p className="tracking-[0.18em] uppercase text-xs">Studio</p>
          <nav className="flex flex-wrap items-center gap-3 md:gap-4">
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
        </div>
      </div>
      {children}
    </div>
  );
}
