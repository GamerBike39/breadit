import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request){

    const url = new URL(req.url);

    const session = await getAuthSession();

    let followedCommunitiesIds : string[] = [];

    if(session){
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                subReddit: true
            },
        });

        followedCommunitiesIds = followedCommunities.map(({subReddit}) => subReddit.id);
    }

    try {
        const {limit, page, subredditName} = z.object({
            limit: z.string(),
            page : z.string(),
            subredditName : z.string().nullish().optional()
        }).parse({
            subredditName: url.searchParams.get("subredditName"),
            limit : url.searchParams.get("limit"),
            page : url.searchParams.get("page")
        });

        let whereClause = {};

        if(subredditName){
            whereClause = {
                subReddit: {
                    name: subredditName
                }
            }
        } else if (session) {
            whereClause = {
                subRedditId: {
                    id : {
                    in: followedCommunitiesIds
                    }
                }
            }
        }

        const posts = await db.post.findMany({
            take : parseInt(limit),
            skip : (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc"
            }
        });

    } catch (error) {
        
    }

}