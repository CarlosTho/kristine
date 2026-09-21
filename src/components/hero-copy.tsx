"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveHeroCopyAction } from "@/lib/actions";

function TitleLine({ title, accent }: { title: string; accent: string }) {
  if (!accent) return title;
  const index = title.toLowerCase().indexOf(accent.toLowerCase());
  if (index < 0) return title;
  return (
    <>
      {title.slice(0, index)}
      <em className="italic text-[var(--brass-deep)]">{title.slice(index, index + accent.length)}</em>
      {title.slice(index + accent.length)}
    </>
  );
}

export function HeroCopy({
  isAdmin,
  welcomeLine,
  titleLine,
  accentWord,
  tagline,
}: {
  isAdmin: boolean;
  welcomeLine: string;
  titleLine: string;
  accentWord: string;
  tagline: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(welcomeLine);
  const [title, setTitle] = useState(titleLine);
  const [accent, setAccent] = useState(accentWord);
  const [line, setLine] = useState(tagline);

  if (!isAdmin || !editing) {
    return (
      <div>
        <p className="rise text-lg font-medium tracking-[0.12em] uppercase text-[var(--brass-deep)] md:text-2xl">
          {welcomeLine}
        </p>
        <h1 className="rise rise-2 mt-3 font-display text-[clamp(2.15rem,11vw,6.5rem)] leading-[0.9] tracking-[-0.045em] md:mt-4">
          <TitleLine title={titleLine} accent={accentWord} />
        </h1>
        <p className="rise rise-3 mt-5 max-w-xl text-base leading-7 text-[var(--muted)] md:mt-6 md:text-lg md:leading-8">
          {tagline}
        </p>
        {isAdmin ? (
          <button
            type="button"
            className="mt-3 text-xs tracking-[0.14em] uppercase text-[var(--brass-deep)] opacity-70 hover:opacity-100"
            onClick={() => {
              setWelcome(welcomeLine);
              setTitle(titleLine);
              setAccent(accentWord);
              setLine(tagline);
              setMessage(null);
              setEditing(true);
            }}
          >
            Edit intro
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        start(async () => {
          const result = await saveHeroCopyAction({
            welcomeLine: welcome,
            titleLine: title,
            accentWord: accent,
            tagline: line,
          });
          if (result.ok) {
            setEditing(false);
            router.refresh();
          } else {
            setMessage(result.error);
          }
        });
      }}
    >
      <p className="text-xs tracking-[0.14em] uppercase text-[var(--brass-deep)]">Editing intro</p>
      <label className="grid gap-1 text-sm">
        Small line
        <input
          value={welcome}
          onChange={(event) => setWelcome(event.target.value)}
          className="field rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base"
          maxLength={80}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="field rounded-xl border border-[var(--line)] bg-white px-4 py-3 font-display text-xl"
          maxLength={160}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Word to highlight
        <input
          value={accent}
          onChange={(event) => setAccent(event.target.value)}
          className="field rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base"
          maxLength={80}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Short paragraph
        <textarea
          value={line}
          onChange={(event) => setLine(event.target.value)}
          rows={3}
          className="field rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base"
          maxLength={280}
        />
      </label>
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
  );
}
