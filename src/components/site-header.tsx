"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/site-shell";

export function SiteHeader({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[var(--cream)]">
      <SiteShell className="flex min-w-0 items-center justify-between gap-2 py-3 md:gap-6 md:py-4">
        <Link href="/" className="brand-mark min-w-0 no-underline leading-none">
          <p className="kicker mb-0.5">Blog</p>
          <span className="block whitespace-nowrap font-display text-[1.05rem] italic tracking-tight sm:text-2xl md:text-3xl">
            {name}
          </span>
        </Link>
        <nav className="flex shrink-0 items-center justify-end gap-2.5 md:gap-6" aria-label="Primary">
          <Link
            href="/"
            className="nav-link !text-[var(--brass-deep)] !opacity-95"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="btn btn-primary rounded-full px-3 py-1.5 text-xs no-underline md:px-4 md:py-2 md:text-sm"
              aria-current={pathname.startsWith("/admin") && !pathname.includes("/login") ? "page" : undefined}
            >
              Dashboard
            </Link>
          ) : null}
        </nav>
      </SiteShell>
    </header>
  );
}
