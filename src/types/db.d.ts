import { SubReddit, Post, User, Comment, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
    subReddit : SubReddit,
    author : User,
    comments : Comment[],
    votes : Vote[],
}