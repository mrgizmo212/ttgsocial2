import LoadingIcon from "../common/icons/LoadingIcon.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { LoadMoreForFeed } from "./LoadMoreForFeed.tsx";
import { fadeInFeedMotionProps } from "../../animations/motionAnimations.ts";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { FeedType } from "../../types/FeedType.ts";
import { NoContentMessage } from "./NoContentMessage.tsx";
import type { PostType } from "../../types/PostType.ts";
import Tweet from "../tweet/Tweet.tsx";

type FeedProps = {
  postIdsArray: number[];
  isLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  tabType?: FeedType;
  userId?: number;
  reverseFeed?: boolean;
};

function Feed({
  userId,
  postIdsArray,
  fetchNextPage,
  reverseFeed,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  tabType,
}: FeedProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (fetchNextPage) {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const postTypeForFeed: PostType | undefined =
    tabType == "Replies"
      ? "ReplyFeedPost"
      : tabType == "Tweets"
      ? "TweetFeedPost"
      : undefined;

  if (isLoading) {
  return (
    <div className="flex justify-center py-2 flex-col w-full">
      <LoadingIcon />
    </div>
  );
}

  return (
    <div className="w-full flex flex-col">
          <div
            className={`flex ${
              reverseFeed ? "flex-col-reverse" : "flex-col"
            } w-full`}
            key="feed-wrapper"
          >
            {postIdsArray.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {postIdsArray.map((id) => (
                  <motion.div
                    key={id}
                    {...fadeInFeedMotionProps}
                    layout="position"
                  >
                    <Tweet
                      repostUserId={tabType == "Tweets" ? userId : undefined}
                      postId={id}
                      postType={postTypeForFeed}
                    />
                  </motion.div>
                ))}
                {!reverseFeed && (
                  <LoadMoreForFeed
                    triggerRef={ref}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                )}
              </AnimatePresence>
            ) : (
              tabType != null && (
                <NoContentMessage userId={userId} tabType={tabType} />
              )
            )}
          </div>
    </div>
  );
}

export default Feed;
