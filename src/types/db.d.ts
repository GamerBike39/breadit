import { SubReddit, Post, User, Comment, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
    subreddit : SubReddit,
    author : User,
    comments : Comment[],
    votes : Vote[],
}