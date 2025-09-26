import { usePost } from "../../../hooks/queries/usePost.tsx";
import { useUser } from "../../../hooks/queries/useUser.tsx";
import { DropdownMenuEllipsis } from "../../modal/dropdown/DropdownMenuEllipsis.tsx";
import { UserHoverCardTrigger } from "../../modal/hover_card/UserHoverCardTrigger.tsx";
import DisplayNameComponent from "../../user/DisplayNameComponent.tsx";
import UsernameComponent from "../../user/UsernameComponent.tsx";
import { TweetCreatedAgo } from "../TweetCreatedAgo.tsx";

type PostUserCardProps = {
  postId: number;
  mainPost?: boolean;
  isReplyFeedPost?: boolean;
  postUserId?: number;
  isModal?: boolean;
};

export function PostUserCard({
  postId,
  postUserId,
  mainPost,
  isModal,
}: PostUserCardProps) {
  const { data: post } = usePost(postId);

  const { data: postUser } = useUser(postUserId ?? -1);

  //TODO extract verified into own component

  return (
    <>
      <div
        className={`flex ${
          mainPost ? "flex-col" : "justify-between"
        } text-twitterText w-full`}
      >
        {postUser && (
          <div className="flex w-full justify-between">
            <div className="flex gap-1 w-full min-w-0 h-fit overflow-hidden">
              <UserHoverCardTrigger userId={postUser.id}>
                <div className="flex gap-1 min-w-0 h-fit items-center">
                  <div className="font-bold truncate min-w-0">
                    <DisplayNameComponent
                      user={postUser}
                      truncate={!mainPost}
                    />
                  </div>
                </div>
              </UserHoverCardTrigger>
              <UserHoverCardTrigger userId={postUser.id}>
                <div className="text-twitterTextAlt text-md truncate min-w-0">
                  <UsernameComponent truncate={!mainPost} user={postUser} />
                </div>
              </UserHoverCardTrigger>

              <TweetCreatedAgo
                open={!mainPost && !!post}
                createdAt={post?.createdAt}
              />

            </div>

            {!isModal && (
              <div className="flex-shrink-0 pl-2">
                <DropdownMenuEllipsis postId={postId} mainPost={mainPost} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
