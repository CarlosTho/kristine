import Link from "next/link";
import { listAllPosts } from "@/lib/queries";
import { DeletePostButton } from "@/components/delete-post-button";

export default async function StudioHomePage() {
  const posts = await listAllPosts();

  return (
    <div className="site-shell ml-[3.75rem] mr-4 w-[min(1120px,calc(100%-4.75rem))] py-8 md:ml-[5.75rem] md:mr-8 md:w-[min(1120px,calc(100%-7.75rem))] md:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">Compose</p>
          <h1 className="mt-2 font-display text-4xl">Your notes</h1>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary rounded-full px-5 py-3">
          New note
        </Link>
      </div>
      <ul className="mt-8 grid gap-3">
        {posts.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)] px-5 py-10 text-center text-[var(--muted)]">
            No notes yet. Start with a new note.
          </li>
        ) : null}
        {posts.map((post) => (
          <li
            key={post.id}
            className="studio-row flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-5 py-4"
          >
            <div>
              <p className="kicker">{post.published ? "Published" : "Draft"} · {post.category}</p>
              <h2 className="mt-1 text-xl">{post.title}</h2>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/posts/${post.id}`} className="btn btn-ghost rounded-full px-4 py-2 text-sm">
                Edit
              </Link>
              <DeletePostButton id={post.id} title={post.title} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
