import { useNavigate } from "react-router-dom";
import React from "react";
import { usePost } from "../../hooks/queries/usePost.tsx";
import { useUser } from "../../hooks/queries/useUser.tsx";
import { YouReposted } from "./tweetInfo/YouReposted.tsx";
import { ReplyingTo } from "./tweetInfo/ReplyingTo.tsx";
import { motion, type Variants } from "framer-motion";
import type { PostType } from "../../types/PostType.ts";
import { TweetMainRow } from "./TweetLayout/TweetMainRow.tsx";
import { ExtraMainTweetRows } from "./TweetLayout/ExtraMainTweetRows.tsx";
import { TweetImagesRow } from "./TweetLayout/TweetImagesRow.tsx";
import { PostInteractionRow } from "./TweetLayout/PostInteractionRow.tsx";
import { Pinned } from "./tweetInfo/Pinned.tsx";

type TweetProps = {
  postId: number;
  isModal?: boolean;
  isParentPost?: boolean;
  postType?: PostType;
  isPinned?: boolean;
  repostUserId?: number;
};

function Tweet({
  postId,
  isModal,
  isParentPost,
  postType,
  isPinned,
  repostUserId,
}: TweetProps) {
  const { data: post } = usePost(postId);

  const { data: postUser } = useUser(post?.userId ?? -1);

  const { data: repostUser } = useUser(repostUserId ?? -1);

  const retweeted = repostUser && repostUser?.retweets.includes(postId);

  const isMainPost = postType == "MainPost";
  const isReplyFeedPost = postType == "ReplyFeedPost";
  const isTweetsFeedPost =
    retweeted && !isPinned && postType == "TweetFeedPost";
  const isPinnedFeedPost = isPinned && postType == "TweetFeedPost";
  const hasImages = post && post.postMedia?.length > 0;
  const hasParent =
    post && post.parentId && (isReplyFeedPost || isMainPost) && !isParentPost;

  const variants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const navigate = useNavigate();

  const navigateToPost = () => {
    if (!isMainPost) {
      navigate("/tweet/" + postId);
    }
  };

  return (
    <>
      {post && (
        <motion.div
          className=""
          {...(!isModal ? { ...variants, layout: "position" } : {})}
          animate={{
            ...variants.animate,
            ...(post.parentId &&
              !isMainPost && { transition: { duration: 0.2 } }),
          }}
        >
          <div
            onClick={() => navigateToPost()}
            className={`flex flex-col w-full border-gray-700 ${
              !isParentPost && !isMainPost ? "border-b" : ""
            }`}
          >
            {/* SEPERATE ROW FOR POST PARENT - ONLY FOR POSTS THAT ARE REPLIES */}
            {hasParent && post.parentId && (
              <Tweet postId={post.parentId} isParentPost={true} />
            )}

            <div
              className={`grid ${
                !isMainPost && "hover:bg-twitterTextAlt/10 hover:cursor-pointer"
              } px-4 ${
                !hasParent ? "pt-3" : ""
              } grid-cols-[auto_1fr] border-twitterBorder gap-x-3 w-full`}
            >
              {/* SEPERATE ROW FOR YOU REPOSTED - ONLY ON "TWEETS" FEED POSTS     */}
              {isTweetsFeedPost && !isPinned && (
                <YouReposted reposter={repostUser} />
              )}
              {isPinnedFeedPost && <Pinned />}

              {/* CORE ROW - SHOWS PROFILE PIC, User's names, and optionally post text */}
              <TweetMainRow
                isModal={isModal}
                post={post}
                postUser={postUser}
                isMainPost={isMainPost}
                isParentPost={isParentPost}
              />

              {/* EXTRA ROW - ONLY FOR MAIN POSTS, shows post text on seperate rows */}
              {isMainPost && (
                <ExtraMainTweetRows post={post} postUser={postUser} />
              )}

              {/* FOURTH ROW - SHOWS IMAGES */}
              {(hasImages || post.pollId) && (
                <TweetImagesRow
                  post={post}
                  isParentPost={isParentPost}
                  isMainPost={isMainPost}
                />
              )}

              {/* FIFTH ROW - SHOWS POST INTERACTIONS IF NOT A REPLY */}
              {!isModal ? (
                <PostInteractionRow
                  post={post}
                  isMainPost={isMainPost}
                  isParentPost={isParentPost}
                />
              ) : (
                <ReplyingTo postUser={postUser} parentId={post.parentId} />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default React.memo(Tweet);
