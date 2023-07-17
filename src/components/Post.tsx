import { formatTimeToNow } from '@/lib/utils';
import { Post, User, Vote } from '@prisma/client';
import { Edit, MessageSquare } from 'lucide-react';
import { FC, useRef } from 'react';
import EditorOutput from './EditorOutput';
import PostVoteClient from './post-vote/PostVoteClient';
import { useSession } from 'next-auth/react';

type PartialVote = Pick<Vote, 'type'>


interface PostProps {
 subredditName?: string;
 post : Post & {
    author : User;
    votes : Vote[];
 },
    commentAmt : number;
    votesAmt : number;
    currentVote? : PartialVote
}

const Post: FC<PostProps> = ({ subredditName, post, commentAmt, votesAmt : votesAmt, currentVote }) => {

    const pRef = useRef<HTMLDivElement>(null)

    const {data : session} = useSession()
    

  return (
   <div className='rounded-md bg-white shadow'>
    <div className='px-6 py-4 flex justify-between'>
        {/* TODO : PostVotes */}
        <PostVoteClient initialVotesAmt={votesAmt} postId={post.id} initialVote={currentVote?.type} />
        <div className='w-0 flex-1 relative'>
            <div className='max-h-40 mt-1 text-xs text-gray-500'>
                {subredditName ? (
                    <>
                    <a className='underline text-zinc-900 text-sm underline-offset-2' href={`/r/${subredditName}`}>
                        r/{subredditName}
                    </a>
                    <span className='px-1'>•</span>
                    </>
                ) : null}
                <span>Posted by u/{post.author.name}</span>
                <span className='px-1'>•</span>
                {formatTimeToNow(new Date(post.createdAt))}
    
                    {/* TODO a btn for edit post */}
                    {/* this button is visible uniquely if this is the author of post */}
                    {session?.user.id === post.authorId ? 
                    (
                    <a className='absolute -right-3 -top-1 md:right-0 md:top-0  z-10' href={`/r/${subredditName}/edit/${post.id}`}>
                         <Edit className='w-3 h-3 md:w-6 md:h-6'/>
                    </a>
                    ) : null}
                
            
            
            </div>
            <a href={`/r/${subredditName}/post/${post.id}`}>
                <h1 className='text-lg font-semibold py-2 leading-6 text-zinc-900'>{post.title}</h1>
            </a>
            <div ref={pRef} className='relative text-sm max-h-40 w-full overflow-clip'>

                <EditorOutput content={post.content} />

                {pRef.current?.clientHeight === 160 ? (
                    <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />

                ) : null}
            </div>
        </div>
    </div>

            <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6 relative'>
            <a className='w-fit flex items-center gap-2' href={`/r/${subredditName}/post/${post.id}`}>
                    <MessageSquare className='w-5 h-5' /> {commentAmt} comments
            </a>
            </div>

   </div>
   );
}

export default Post;