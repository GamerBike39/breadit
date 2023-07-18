'use client';

import { FC, useRef } from 'react';
import UserAvatar from './UserAvatar';
import { Comment, CommentVote, User } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import CommentVotes from './CommentVotes';
import { Button } from './ui/Button';
import { MessageSquare } from 'lucide-react';

type ExtendedComment = Comment & {
    votes : CommentVote[];
    author : User;
}

interface PostCommentProps {
 comment : ExtendedComment
    votesAmt : number;
    currentVote? : CommentVote | undefined;
    postId : string;
}

const PostComment: FC<PostCommentProps> = ({ comment, votesAmt, currentVote }) => {

    const commentRef = useRef<HTMLDivElement>(null);

  return (
   <div ref={commentRef} className='flex flex-col '>
       <div className='flex items-center'>
            <UserAvatar user={{
                name : comment.author.name,
                image : comment.author.image,
            }}
            className='w-6 h-6'
            />

            <div className="flex items-center gap-x-2 ml-2">
                <p className='text-sm font-medium text-gray-900'>
                    u/{comment.author.name}
                </p>
                <p className='max-h-40 truncate text-xs text-zinc-500'>
                    {formatTimeToNow(new Date(comment.createdAt))}
                </p>
            </div>
       </div>


        <p className='text-sm text-zinc-900 mt-2'>
            {comment.text}
        </p>

        <div className="flex gap-2 items-center">
            <CommentVotes commentId={comment.id} initialVote={currentVote} initialVotesAmt={votesAmt} />
        <Button variant={"ghost"} size={'xs'}>
            <MessageSquare className='h-4 w-4 mr-1.5' />Reply
        </Button>
        </div>


   </div>
   );
}

export default PostComment;