import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {z} from 'zod';
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";

export async function POST(req : Request){
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorized', {status: 401})
        }

        const body = await req.json()

        const {subRedditId} = SubredditSubscriptionValidator.parse(body)

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subRedditId,
                userId: session.user.id
            },
        })

        if(!subscriptionExists){
            return new Response('You are not subscbribe to this subreddit', {status: 400})
        }

        // check if user is the owner of the subreddit
        const subreddit = await db.subReddit.findFirst({
            where: {
                id: subRedditId,
                creatorId: session.user.id
            }
        })

        if(subreddit){
            return new Response('You cannot unsubscribe from your own subreddit', {status: 400})
        }

        await db.subscription.delete({
            where: {
                userId_subRedditId:{
                    subRedditId,
                    userId: session.user.id
                }
            }
        })

        return new Response(subRedditId, {status: 200})

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid request data passed", { status: 422 })
        }

        return new Response('Could not unsubscribe, please try again later', { status: 500 })    
    }
}