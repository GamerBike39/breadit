import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comments";
import { z } from "zod";

export async function PATCH(req: Request){
    try {
        const body = await req.json();

        const {postId, text, replyToId} = CommentValidator.parse(body);

        const session = await getAuthSession()

        if(!session){
            return new Response("Unauthorized", {status : 401})
        }

        await db.comment.create({
            data : {
                text,
                postId,
                replyToId,
                authorId : session.user.id,
            }
        })

        return new Response("Comment created", {status : 201})

    } catch (error) {
        if (error instanceof z.ZodError){
            return new Response("invalid POST request data passer", {status : 422})
        }
        return new Response("Could not create Comment, please try again later", {status : 500})
    }
}