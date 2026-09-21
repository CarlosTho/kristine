export function Portrait({
  src,
  name,
  className = "",
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "K";

  return (
    <div className={`relative bg-transparent ${className}`}>
      {src ? (
        // User-uploaded portraits live in /public/uploads and change over time.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Portrait of ${name}`}
          className="h-full w-full object-contain object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
          <span className="font-display text-7xl">{initial}</span>
        </div>
      )}
    </div>
  );
}
