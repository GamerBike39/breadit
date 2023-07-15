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

        if(subscriptionExists){
            return new Response('Already subscribed', {status: 400})
        }

        await db.subscription.create({
            data: {
                subRedditId,
                userId: session.user.id
            }
        })

        return new Response('Subscribed', {status: 200})

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid request data passed", { status: 422 })
        }

        return new Response('Could not subscribe, please try again later', { status: 500 })    
    }
}