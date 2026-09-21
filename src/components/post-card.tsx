import Link from "next/link";
import type { PostRecord } from "@/lib/queries";

export function PostCard({
  post,
  index = 0,
  variant = "feature",
}: {
  post: PostRecord;
  index?: number;
  variant?: "feature" | "list";
}) {
  const number = String(index + 1).padStart(2, "0");
  const date = post.createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (variant === "list") {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="post-card rise grid min-w-0 grid-cols-[2.2rem_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-4 no-underline sm:grid-cols-[3.4rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:px-5 sm:py-5"
        style={{ animationDelay: `${0.12 + index * 0.08}s` }}
      >
        <span className="font-display text-2xl italic text-[var(--brass-deep)]">{number}</span>
        <div className="min-w-0">
          <p className="kicker">
            {post.category} · {date}
          </p>
          <h2 className="mt-1 font-display text-xl leading-tight break-words sm:text-2xl">{post.title}</h2>
          <span className="read-cue mt-3 inline-flex whitespace-nowrap sm:hidden">Read more →</span>
        </div>
        <span className="read-cue mt-0 hidden whitespace-nowrap sm:inline-flex">Read more →</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="post-card rise grid min-w-0 gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3 shadow-[var(--shadow)] no-underline md:grid-cols-2 md:gap-4 md:rounded-3xl md:p-4"
      style={{ animationDelay: `${0.08 + index * 0.08}s` }}
    >
      <div className="media-frame min-h-44 rounded-2xl md:min-h-56">
        {post.coverPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverPath} alt="" />
        ) : (
          <div className="flex h-full min-h-44 items-end bg-[linear-gradient(160deg,#1f2a22,#8c3322)] p-5 md:min-h-56 md:p-6">
            <p className="font-display text-2xl italic text-[var(--cream)] md:text-4xl">{post.title}</p>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center px-1 py-2 md:px-3 md:py-4">
        <p className="kicker">
          {number} · {post.category}
        </p>
        <h2 className="mt-2 font-display text-2xl leading-[0.95] italic break-words md:mt-3 md:text-4xl">{post.title}</h2>
        <p className="mt-3 leading-7 break-words [overflow-wrap:anywhere] text-[var(--muted)] md:mt-4">{post.excerpt}</p>
        <span className="read-cue inline-flex whitespace-nowrap">Read more →</span>
      </div>
    </Link>
  );
}
