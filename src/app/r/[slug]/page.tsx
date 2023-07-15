import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        slug: string;
    }
}

const page = async ({ params } : PageProps) => {

    const {slug} = params

    const session = await getAuthSession()

    const subreddit = await db.subReddit.findFirst({
        where: { name : slug },
        include: {
            posts : {
                include: {
                    author : true,
                    votes : true,
                    comments : true,
                    subReddit : true,
                },
                take : INFINITE_SCROLLING_PAGINATION_RESULTS,
            }
        }
    })

    if(!subreddit) {
        return notFound()
    }

    // if subreddit.name has a dash, replace it with a space
     if(subreddit.name.includes('-')) {
            subreddit.name = subreddit.name.replace('-', ' ')                           
    }

  return (
   <>
       <h1 className="font-bold text-3xl md:text-4xl h-14">
              r/{subreddit.name}
       </h1>
       <MiniCreatePost  session={session}/>
       <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name}/>
   </>
   );
}

export default page;