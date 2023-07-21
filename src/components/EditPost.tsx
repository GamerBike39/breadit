import { getAuthSession } from "@/lib/auth";
import { Post, User } from "@prisma/client";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";

interface EditPostProps {
  subredditName?: string;
  post: Post & {
    author: User;
    id: string;
  };
}

const EditPost = ({ subredditName, post }: EditPostProps) => {
  //   const session = await getAuthSession();
  const { data: session } = useSession();
  return session?.user.id === post.authorId ? (
    <a
      className="absolute -right-3 -top-1 md:right-0 md:top-0  z-10"
      href={`/r/${subredditName}/edit/${post.id}`}
    >
      <Edit className="w-3 h-3 md:w-6 md:h-6" />
    </a>
  ) : null;
};

export default EditPost;
