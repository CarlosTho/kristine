"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFooterCopyAction } from "@/lib/actions";
import { SiteShell } from "@/components/site-shell";

export function SiteFooter({
  name,
  isAdmin,
  closingNote,
}: {
  name: string;
  isAdmin: boolean;
  closingNote: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [note, setNote] = useState(closingNote);

  return (
    <SiteShell as="footer" className="relative z-[2] mt-8 border-t border-[var(--line)] py-8 text-sm text-[var(--muted)] md:py-10">
      {isAdmin && editing ? (
        <form
          className="grid max-w-2xl gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(null);
            start(async () => {
              const result = await saveFooterCopyAction({ closingNote: note });
              if (result.ok) {
                setEditing(false);
                router.refresh();
              } else {
                setMessage(result.error);
              }
            });
          }}
        >
          <p className="text-xs tracking-[0.14em] uppercase text-[var(--brass-deep)]">Editing footer</p>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            className="field rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--ink)]"
            maxLength={800}
          />
          {message ? <p className="text-sm text-[#8f3d34]">{message}</p> : null}
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary rounded-full px-5 py-2 text-sm" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-ghost rounded-full px-5 py-2 text-sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="max-w-2xl leading-7">
          {closingNote}
          {isAdmin ? (
            <>
              {" "}
              <button
                type="button"
                className="text-xs tracking-[0.14em] uppercase text-[var(--brass-deep)] opacity-70 hover:opacity-100"
                onClick={() => {
                  setNote(closingNote);
                  setMessage(null);
                  setEditing(true);
                }}
              >
                Edit
              </button>
            </>
          ) : null}
        </p>
      )}
      <p className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span>© 2026 {name}</span>
        <span className="flex items-center gap-4">
          <a href="/about" className="text-xs tracking-[0.14em] uppercase no-underline opacity-60 hover:opacity-100">
            About
          </a>
          <a href="/rss.xml" className="text-xs tracking-[0.14em] uppercase no-underline opacity-60 hover:opacity-100">
            RSS
          </a>
          <a
            href="https://www.linkedin.com/in/kristine-huaman/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.14em] uppercase no-underline opacity-60 hover:opacity-100"
          >
            LinkedIn
          </a>
          {isAdmin ? (
            <a href="/admin" className="text-xs tracking-[0.14em] uppercase no-underline opacity-60 hover:opacity-100">
              Dashboard
            </a>
          ) : null}
        </span>
      </p>
    </SiteShell>
  );
}
