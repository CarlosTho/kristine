import { PostEditor } from "@/components/post-editor";
import { SiteShell } from "@/components/site-shell";

export default function NewPostPage() {
  return (
    <SiteShell className="py-8 md:py-10">
      <p className="kicker">New note</p>
      <p className="mt-2 mb-8 text-[var(--muted)]">
        Title first, then stack sections the way you would add slides — text, heading, quote, or photo.
      </p>
      <PostEditor />
    </SiteShell>
  );
}
