import { PostEditor } from "@/components/post-editor";

export default function NewPostPage() {
  return (
    <div className="site-shell ml-[3.75rem] mr-4 w-[min(1120px,calc(100%-4.75rem))] py-8 md:ml-[5.75rem] md:mr-8 md:w-[min(1120px,calc(100%-7.75rem))] md:py-10">
      <p className="kicker">New note</p>
      <p className="mt-2 mb-8 text-[var(--muted)]">
        Title first, then stack sections the way you would add slides — text, heading, quote, or photo.
      </p>
      <PostEditor />
    </div>
  );
}
