import { useEffect } from "react";
import type { Post } from "../../../types/Post";
import TweetInteractions from "../TweetInteractions.tsx";
import { PostLine } from "../tweetInfo/PostLine";

type PostInteractionRowProps = {
  post: Post;
  isMainPost?: boolean;
  isParentPost?: boolean;
};

export function PostInteractionRow({
  post,
  isMainPost,
  isParentPost,
}: PostInteractionRowProps) {
  useEffect(() => {
    console.log("Post id " + post.id + "Replies list", post.replies);
  }, []);

  return (
    <>
      {isParentPost && <PostLine showLine={isParentPost} />}
      <div
        className={`w-full ${
          isMainPost ? "col-span-2" : "col-start-2"
        }  text-lg border-twitterBorder`}
      >
        <TweetInteractions showPadding={isMainPost} postId={post.id} />
      </div>
    </>
  );
}
