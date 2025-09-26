import type { Post } from "../../../types/Post";
import { TweetImageGrid } from "../../layout/media/TweetImageGrid.tsx";
import { Poll } from "../Poll";
import { PostLine } from "../tweetInfo/PostLine";

type TweetImagesRowProps = {
  post: Post;
  isParentPost?: boolean;
  isMainPost?: boolean;
};

export function TweetImagesRow({
  post,
  isParentPost,
  isMainPost,
}: TweetImagesRowProps) {
  return (
    <>
      {isParentPost && <PostLine showLine={isParentPost} />}
      <div className={`${isMainPost ? "col-span-2" : "col-start-2"} `}>
        {post.postMedia && post.postMedia.length > 0 ? (
          <TweetImageGrid media={post.postMedia} />
        ) : (
          post.pollId && <Poll pollId={post.pollId} post={post} />
        )}
      </div>
    </>
  );
}
