import {z} from 'zod';

export const PostValidator = z.object({
    postId : z.string().optional(),
    title: z.string()
    .min(3, {message : 'Title must be longer than 3 characters'})
    .max(125, {message : 'Title must be shorter than 125 characters'}),

    subRedditId : z.string(),
    content : z.any(),

});

export type PostCreationRequest = z.infer<typeof PostValidator>;
export type PostUpdateRequest = z.infer<typeof PostValidator>;