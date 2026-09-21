"use client";

import { ImagePicker } from "@/components/image-picker";

export type DraftBlock = {
  key: string;
  type: "title" | "excerpt" | "cover" | "heading" | "paragraph" | "quote" | "image";
  content: string;
  imagePath: string | null;
};

const LABELS: Record<DraftBlock["type"], string> = {
  title: "Title",
  excerpt: "Summary",
  cover: "Cover photo",
  heading: "Heading",
  paragraph: "Text",
  quote: "Quote",
  image: "Photo",
};

export function SectionList({
  sections,
  onMove,
  onRemove,
  onUpdate,
  onAdd,
}: {
  sections: DraftBlock[];
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (key: string) => void;
  onUpdate: (key: string, patch: Partial<DraftBlock>) => void;
  onAdd: (type: DraftBlock["type"]) => void;
}) {
  const types = new Set(sections.map((section) => section.type));

  return (
    <div className="grid gap-4">
      <p className="kicker">Note layout</p>
      {sections.map((section, index) => (
        <article key={section.key} className="editor-block rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
          <SectionToolbar
            label={LABELS[section.type]}
            canUp={index > 0}
            canDown={index < sections.length - 1}
            onUp={() => onMove(index, -1)}
            onDown={() => onMove(index, 1)}
            onRemove={() => onRemove(section.key)}
          />
          <SectionFields section={section} onUpdate={onUpdate} />
        </article>
      ))}
      <div className="flex flex-wrap gap-2">
        {!types.has("title") ? (
          <button type="button" className="btn btn-ghost rounded-full px-4 py-2" onClick={() => onAdd("title")}>
            + Title
          </button>
        ) : null}
        {!types.has("excerpt") ? (
          <button type="button" className="btn btn-ghost rounded-full px-4 py-2" onClick={() => onAdd("excerpt")}>
            + Summary
          </button>
        ) : null}
        {!types.has("cover") ? (
          <button type="button" className="btn btn-ghost rounded-full px-4 py-2" onClick={() => onAdd("cover")}>
            + Cover
          </button>
        ) : null}
        <button type="button" className="btn btn-ghost rounded-full px-4 py-2" onClick={() => onAdd("paragraph")}>
          + Text
        </button>
        <button type="button" className="btn btn-ghost rounded-full px-4 py-2" onClick={() => onAdd("heading")}>
          + Heading
        </button>
        <button type="button" className="btn btn-ghost rounded-full px-4 py-2" onClick={() => onAdd("quote")}>
          + Quote
        </button>
        <button type="button" className="btn btn-ghost rounded-full px-4 py-2" onClick={() => onAdd("image")}>
          + Photo
        </button>
      </div>
    </div>
  );
}

function SectionToolbar({
  label,
  canUp,
  canDown,
  onUp,
  onDown,
  onRemove,
}: {
  label: string;
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost rounded-full px-3 py-1 text-xs" disabled={!canUp} onClick={onUp}>
          Up
        </button>
        <button type="button" className="btn btn-ghost rounded-full px-3 py-1 text-xs" disabled={!canDown} onClick={onDown}>
          Down
        </button>
        <button type="button" className="btn btn-ghost rounded-full px-3 py-1 text-xs" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

function SectionFields({
  section,
  onUpdate,
}: {
  section: DraftBlock;
  onUpdate: (key: string, patch: Partial<DraftBlock>) => void;
}) {
  if (section.type === "cover") {
    return (
      <ImagePicker
        label="Cover photo"
        kind="cover"
        value={section.imagePath}
        onChange={(path) => onUpdate(section.key, { imagePath: path })}
      />
    );
  }

  if (section.type === "image") {
    return (
      <div className="grid gap-3">
        <ImagePicker
          label="Section photo"
          kind="section"
          value={section.imagePath}
          onChange={(path) => onUpdate(section.key, { imagePath: path })}
        />
        <input
          value={section.content}
          onChange={(event) => onUpdate(section.key, { content: event.target.value })}
          placeholder="Optional caption"
          maxLength={160}
          className="rounded-xl border border-[var(--line)] px-4 py-3"
        />
      </div>
    );
  }

  if (section.type === "title") {
    return (
      <textarea
        value={section.content}
        onChange={(event) => onUpdate(section.key, { content: event.target.value })}
        rows={2}
        maxLength={140}
        placeholder="What is this note called?"
        className="w-full resize-none bg-transparent font-display text-4xl leading-tight outline-none"
      />
    );
  }

  const rows = section.type === "excerpt" || section.type === "heading" ? 2 : 5;
  const placeholder =
    section.type === "excerpt"
      ? "One or two sentences for the homepage card."
      : section.type === "quote"
        ? "A line worth keeping"
        : section.type === "heading"
          ? "Section heading"
          : "Write this section";

  return (
    <textarea
      value={section.content}
      onChange={(event) => onUpdate(section.key, { content: event.target.value })}
      rows={rows}
      maxLength={section.type === "excerpt" ? 280 : undefined}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[var(--line)] px-4 py-3"
    />
  );
}
