"use client";

import { useState, useTransition } from "react";
import { deletePostAction } from "@/lib/actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="grid justify-items-end gap-1">
      <button
        className="btn btn-ghost rounded-full px-4 py-2 text-sm"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
          setError(null);
          start(async () => {
            const result = await deletePostAction(id);
            if (!result.ok) setError(result.error);
          });
        }}
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error ? (
        <p className="text-xs text-[#8f3d34]" role="alert">
          {error}
        </p>
      ) : null}
    </span>
  );
}
