"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type Category, type PostInput } from "@/lib/validation";
import { savePostAction } from "@/lib/actions";
import { SectionList, type DraftBlock } from "@/components/section-list";

function createKey() {
  return `block-${crypto.randomUUID()}`;
}

function toDraft(initial?: PostInput): DraftBlock[] {
  const blocks: DraftBlock[] = [
    { key: "title", type: "title", content: initial?.title ?? "", imagePath: null },
    { key: "excerpt", type: "excerpt", content: initial?.excerpt ?? "", imagePath: null },
    { key: "cover", type: "cover", content: "", imagePath: initial?.coverPath ?? null },
  ];

  if (!initial?.sections.length) {
    blocks.push({ key: "paragraph-0", type: "paragraph", content: "", imagePath: null });
    return blocks;
  }

  for (const [index, section] of initial.sections.entries()) {
    blocks.push({
      key: `section-${index}`,
      type: section.type,
      content: section.content,
      imagePath: section.type === "image" ? section.imagePath : null,
    });
  }

  return blocks;
}

export function PostEditor({ initial }: { initial?: PostInput }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(initial?.category ?? "The Journey");
  const [sections, setSections] = useState<DraftBlock[]>(() => toDraft(initial));

  function updateSection(key: string, patch: Partial<DraftBlock>) {
    setSections((current) =>
      current.map((section) => (section.key === key ? { ...section, ...patch } : section)),
    );
  }

  function moveSection(index: number, direction: -1 | 1) {
    setSections((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      const currentItem = next[index];
      const swapItem = next[target];
      if (!currentItem || !swapItem) return current;
      next[index] = swapItem;
      next[target] = currentItem;
      return next;
    });
  }

  function addSection(type: DraftBlock["type"]) {
    setSections((current) => {
      if ((type === "title" || type === "excerpt" || type === "cover") && current.some((item) => item.type === type)) {
        return current;
      }
      return [...current, { key: createKey(), type, content: "", imagePath: null }];
    });
  }

  function save(published: boolean) {
    setError(null);
    start(async () => {
      const title = sections.find((item) => item.type === "title")?.content ?? "";
      const excerpt = sections.find((item) => item.type === "excerpt")?.content ?? "";
      const coverPath = sections.find((item) => item.type === "cover")?.imagePath ?? null;
      const payload: PostInput = {
        id: initial?.id,
        title,
        excerpt,
        category,
        coverPath,
        published,
        sections: sections.flatMap((section): PostInput["sections"] => {
          if (section.type === "title" || section.type === "excerpt" || section.type === "cover") {
            return [];
          }
          if (section.type === "image") {
            if (!section.imagePath) return [];
            return [
              {
                type: "image" as const,
                content: section.content,
                imagePath: section.imagePath,
              },
            ];
          }
          if (!section.content.trim()) return [];
          return [
            {
              type: section.type,
              content: section.content,
              imagePath: null,
            },
          ];
        }),
      };
      const result = await savePostAction(payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(published ? `/posts/${result.slug}` : "/admin");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 pb-28">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              category === item
                ? "bg-[var(--navy)] text-[var(--cream)]"
                : "border border-[var(--line)] bg-[var(--paper)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <SectionList
        sections={sections}
        onMove={moveSection}
        onRemove={(key) => setSections((current) => current.filter((item) => item.key !== key))}
        onUpdate={updateSection}
        onAdd={addSection}
      />
      {error ? (
        <p className="text-sm text-[#8f3d34]" role="alert">
          {error}
        </p>
      ) : null}
      <div className="sticky bottom-4 flex flex-wrap gap-3 rounded-full border border-[var(--line)] bg-[var(--paper)]/95 p-2 shadow-[var(--shadow)] backdrop-blur">
        <button type="button" className="btn btn-ghost flex-1 rounded-full px-5 py-3" disabled={pending} onClick={() => save(false)}>
          {pending ? "Saving" : "Save draft"}
        </button>
        <button type="button" className="btn btn-primary flex-1 rounded-full px-5 py-3" disabled={pending} onClick={() => save(true)}>
          {pending ? "Publishing" : "Publish"}
        </button>
      </div>
    </div>
  );
}
