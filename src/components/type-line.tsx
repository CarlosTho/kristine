"use client";

import { useEffect, useState } from "react";

export function useTypedText(text: string, speed = 48) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const value = text ?? "";
    if (!value) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCount(value.length);
      return;
    }

    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index >= value.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

  return text.slice(0, count);
}

export function TypeLine({
  text,
  className = "",
  speed = 55,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const typed = useTypedText(text, speed);

  return (
    <span className={className} aria-hidden="true">
      {typed}
      <span className="type-caret" aria-hidden="true" />
    </span>
  );
}
