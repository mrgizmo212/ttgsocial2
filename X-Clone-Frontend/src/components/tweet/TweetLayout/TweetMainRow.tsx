import { useNavigate } from "react-router-dom";
import type { Post } from "../../../types/Post";
import type { User } from "../../../types/User";
import ProfilePic from "../../user/ProfilePic";
import { PostUserCard } from "../tweetInfo/PostUserCard";
import { UserHoverCardTrigger } from "../../modal/hover_card/UserHoverCardTrigger.tsx";
type TweetMainRowProps = {
  isParentPost?: boolean;
  isMainPost?: boolean;
  postUser?: User;
  post: Post;
  isModal?: boolean;
};

export function TweetMainRow({
  isParentPost,
  isMainPost,
  postUser,
  post,
  isModal,
}: TweetMainRowProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative w-12 flex justify-center">
        <UserHoverCardTrigger userId={post.userId}>
          <div className="w-12 h-12">
            <ProfilePic userId={post.userId} />
          </div>
        </UserHoverCardTrigger>
        {isParentPost && (
          <div className="absolute top-12 bottom-0 w-px bg-gray-600" />
        )}
      </div>

      <div className="flex overflow-x-hidden flex-col">
        <div className="flex flex-col h-fit">
          <PostUserCard
            postId={post.id}
            isModal={isModal}
            postUserId={postUser?.id}
            mainPost={isMainPost}
          />
        </div>
        {!isMainPost && (
          <div
            className={`text-twitterText whitespace-pre-line w-full break-words mb-2`}
          >
            <p
              className="break-words"
              onClick={() => navigate("/tweet/" + post.id)}
            >
              {post.text}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
