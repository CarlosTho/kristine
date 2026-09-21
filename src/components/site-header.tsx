"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/site-shell";

export function SiteHeader({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[var(--cream)]">
      <SiteShell className="flex items-end justify-between gap-3 pt-5 pb-3 md:min-h-36 md:gap-6 md:pt-10 md:pb-0">
        <Link href="/" className="brand-mark no-underline leading-none">
          <p className="kicker mb-1">Blog</p>
          <span className="font-display text-[1.7rem] italic tracking-tight sm:text-3xl md:text-4xl">{name}</span>
        </Link>
        <nav className="flex shrink-0 items-end justify-end gap-4 pb-1 md:gap-6" aria-label="Primary">
          <Link href="/" className="nav-link" aria-current={pathname === "/" ? "page" : undefined}>
            Blog
          </Link>
          <Link
            href="/about"
            className="nav-link"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="btn btn-primary rounded-full px-4 py-2 text-sm no-underline"
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
