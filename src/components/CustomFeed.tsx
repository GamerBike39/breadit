import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { getAuthSession } from "@/lib/auth";
import GeneralFeed from "./GeneralFeed";

const CustomFeed = async () => {
  
    const session = await getAuthSession();
    const followedCommunities = await db.subscription.findMany({
        where : {
            userId : session?.user.id
        },
        include : {
            subReddit : true
        }
    });

    const posts = await db.post.findMany({
        where : {
            subReddit : {
                name : {
                    in : followedCommunities.map(({subReddit}) => subReddit.id)
                }
            },
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            votes : true,
            subReddit : true,
            author : true,
            comments : true
        },
        take : INFINITE_SCROLLING_PAGINATION_RESULTS
    });

    if(posts.length === 0)  {
        // @ts-expect-error server component
        return <GeneralFeed />
    }

    return <PostFeed initialPosts={posts} />
}

export default CustomFeed