import { notFound } from "next/navigation";
import { PostEditor } from "@/components/post-editor";
import { getPostById } from "@/lib/queries";
import { CATEGORIES, type PostInput } from "@/lib/validation";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const data = await getPostById(id);
  if (!data) notFound();

  const category = CATEGORIES.find((item) => item === data.post.category);
  if (!category) notFound();

  const initial: PostInput = {
    id: data.post.id,
    title: data.post.title,
    excerpt: data.post.excerpt,
    category,
    coverPath: data.post.coverPath,
    published: data.post.published,
    sections: data.sections.flatMap((section): PostInput["sections"] => {
      if (section.type === "image") {
        return [
          {
            type: "image",
            content: section.content,
            imagePath: section.imagePath ?? "",
          },
        ];
      }
      if (section.type === "heading" || section.type === "paragraph" || section.type === "quote") {
        return [
          {
            type: section.type,
            content: section.content,
            imagePath: null,
          },
        ];
      }
      return [];
    }),
  };

  return (
    <div className="site-shell ml-[3.75rem] mr-4 w-[min(1120px,calc(100%-4.75rem))] py-8 md:ml-[5.75rem] md:mr-8 md:w-[min(1120px,calc(100%-7.75rem))] md:py-10">
      <p className="kicker">Edit note</p>
      <div className="mt-6">
        <PostEditor initial={initial} />
      </div>
    </div>
  );
}
