"use client";

import { useState } from "react";
import { uploadImageAction } from "@/lib/actions";

const MAX_BYTES = 3 * 1024 * 1024;

export function ImagePicker({
  label,
  kind,
  value,
  onChange,
}: {
  label: string;
  kind: "cover" | "section" | "portrait";
  value: string | null;
  onChange: (path: string | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const frameClass =
    kind === "portrait"
      ? "media-frame relative grid min-h-40 cursor-pointer place-items-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)]"
      : "post-photo media-frame relative grid cursor-pointer place-items-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)]";

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError("Images must be 3MB or smaller.");
      return;
    }
    setBusy(true);
    setError(null);
    const data = new FormData();
    data.set("file", file);
    data.set("kind", kind);
    const result = await uploadImageAction(data);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange(result.path);
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm">{label}</p>
      <label className={frameClass}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" />
        ) : (
          <span className="px-6 text-center text-sm text-[var(--muted)]">
            {busy ? "Uploading…" : "Tap to add a photo · 3MB max"}
          </span>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void onFile(file);
          }}
        />
      </label>
      {value ? (
        <button
          type="button"
          className="justify-self-start text-sm text-[var(--muted)]"
          onClick={() => onChange(null)}
        >
          Remove photo
        </button>
      ) : null}
      {error ? (
        <p className="text-sm text-[#8f3d34]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
