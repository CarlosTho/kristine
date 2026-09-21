import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell className="py-16 md:py-24">
      <p className="kicker rise">Missing page</p>
      <h1 className="rise rise-2 mt-3 font-display text-4xl md:text-5xl">This note isn’t here.</h1>
      <p className="rise rise-3 mt-4 max-w-lg text-[var(--muted)]">
        The page may have been moved or is still a draft.
      </p>
      <Link href="/" className="btn btn-primary rise rise-4 mt-8 rounded-full px-5 py-3">
        Back to writing
      </Link>
    </SiteShell>
  );
}
