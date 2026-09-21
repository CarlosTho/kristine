"use client";

import { useState, useTransition } from "react";
import { saveProfileAction } from "@/lib/actions";
import { ImagePicker } from "@/components/image-picker";

export function ProfileForm({
  displayName,
  tagline,
  bio,
  portraitPath,
  welcomeLine,
  titleLine,
  accentWord,
  closingNote,
}: {
  displayName: string;
  tagline: string;
  bio: string;
  portraitPath: string | null;
  welcomeLine: string;
  titleLine: string;
  accentWord: string;
  closingNote: string;
}) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState(displayName);
  const [line, setLine] = useState(tagline);
  const [about, setAbout] = useState(bio);
  const [portrait, setPortrait] = useState<string | null>(portraitPath);
  const [welcome, setWelcome] = useState(welcomeLine);
  const [title, setTitle] = useState(titleLine);
  const [accent, setAccent] = useState(accentWord);
  const [note, setNote] = useState(closingNote);

  return (
    <form
      className="grid max-w-2xl gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        start(async () => {
          const result = await saveProfileAction({
            displayName: name,
            tagline: line,
            bio: about,
            portraitPath: portrait,
            welcomeLine: welcome,
            titleLine: title,
            accentWord: accent,
            closingNote: note,
          });
          setMessage(result.ok ? "Saved." : result.error);
        });
      }}
    >
      <ImagePicker label="Portrait" kind="portrait" value={portrait} onChange={setPortrait} />
      <label className="grid gap-2 text-sm">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
          maxLength={80}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Welcome line
        <input
          value={welcome}
          onChange={(event) => setWelcome(event.target.value)}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
          maxLength={80}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Home title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
          maxLength={160}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Highlighted words in the title
        <input
          value={accent}
          onChange={(event) => setAccent(event.target.value)}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
          maxLength={80}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Tagline
        <input
          value={line}
          onChange={(event) => setLine(event.target.value)}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
          maxLength={280}
        />
      </label>
      <label className="grid gap-2 text-sm">
        About
        <textarea
          value={about}
          onChange={(event) => setAbout(event.target.value)}
          rows={8}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
          maxLength={2000}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Footer
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
          maxLength={800}
        />
      </label>
      {message ? <p className="text-sm">{message}</p> : null}
      <button className="btn btn-primary w-fit rounded-full px-6 py-3" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
