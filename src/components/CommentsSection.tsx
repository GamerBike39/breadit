import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Comment, CommentVote, User } from "@prisma/client";
import CreateComment from "./CreateComment";
import PostComment from "./PostComment";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
  replies: ReplyComment[];
};

type ReplyComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface CommentsSectionProps {
  postId: string;
  comments: ExtendedComment[];
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId: postId,
      replyToId: null, // only fetch top-level comments
    },
    include: {
      author: true,
      votes: true,
      replies: {
        // first level replies
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      {/* <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                    postId={postId}
                  />
                </div>

                
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most liked
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div> */}

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentUpVotes = topLevelComment.votes.filter(
              (vote) => vote.type === "UP"
            ).length;

            const topLevelCommentDownVotes = topLevelComment.votes.filter(
              (vote) => vote.type === "DOWN"
            ).length;

            return {
              ...topLevelComment,
              score: topLevelCommentUpVotes - topLevelCommentDownVotes,
              hasVotes:
                topLevelCommentUpVotes > 0 || topLevelCommentDownVotes > 0,
            };
          })
          .sort((a, b) => {
            // Sort by comments with upVotes first
            if (b.score !== a.score) {
              return b.score - a.score;
            } else {
              // Sort by comments with votes (upVotes or downVotes) first
              if (b.hasVotes !== a.hasVotes) {
                return b.hasVotes ? -1 : 1;
              } else {
                // Sort by upVotes (most to least)
                const bUpVotes = b.votes.filter(
                  (vote) => vote.type === "UP"
                ).length;
                const aUpVotes = a.votes.filter(
                  (vote) => vote.type === "UP"
                ).length;
                return bUpVotes - aUpVotes;
              }
            }
          })
          .map((sortedComment) => {
            const topLevelCommentVote = sortedComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={sortedComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={sortedComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={sortedComment.score}
                    postId={postId}
                  />
                </div>

                {/* Render replies */}
                {sortedComment.replies
                  .sort((a, b) => {
                    const aUpVotes = a.votes.filter(
                      (vote) => vote.type === "UP"
                    ).length;
                    const bUpVotes = b.votes.filter(
                      (vote) => vote.type === "UP"
                    ).length;
                    return bUpVotes - aUpVotes; // Sort by most upVotes
                  })
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1; // Ignore downVotes
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
