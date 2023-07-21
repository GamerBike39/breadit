import EditEditor from "@/components/EditEditor";
import { Button } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: pageProps) => {
  const content = await db.post.findFirst({
    where: {
      id: params.id,
    },
  });

  const user = await getAuthSession();

  if (!content) {
    return notFound();
  }

  if (content.authorId !== user?.user?.id) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Update post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            u/ {user?.user?.username}
          </p>
        </div>
      </div>

      {/* form */}
      <EditEditor
        postId={content.id}
        title={content.title}
        content={content.content}
        subRedditId={content.subRedditId}
      />

      <div className="flex w-full justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
