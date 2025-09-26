import { AnimatePresence, motion } from "framer-motion";
import { UserSearchResult } from "../pages/UserSearchResult.tsx";
import { fadeInFeedMotionProps } from "../../animations/motionAnimations.ts";
import { LoadMoreForFeed } from "./LoadMoreForFeed.tsx";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect } from "react";
import LoadingIcon from "../common/icons/LoadingIcon.tsx";
import debounce from "lodash.debounce";

type UserSearchFeedProps = {
  idsToLoad: number[];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoadingUsers?: boolean;
  isInfinite?: boolean;
};

//TODO add loadmore trigger

export function UserSearchFeed({
  idsToLoad,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoadingUsers,
  isInfinite,
}: UserSearchFeedProps) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    skip: !isInfinite,
  });

  const debouncedFetchNextPage = useCallback(
    debounce(() => {
      if (fetchNextPage && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 300),
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (isInfinite && inView && hasNextPage && !isFetchingNextPage) {
      debouncedFetchNextPage();
    }
  }, [
    isInfinite,
    inView,
    hasNextPage,
    isFetchingNextPage,
    debouncedFetchNextPage,
  ]);

  return (
    <div>
      {isLoadingUsers ? (
        <div className="flex justify-center py-2 flex-col w-full">
          <LoadingIcon />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {idsToLoad.map((userId: number) => (
            <motion.div
              key={userId}
              {...fadeInFeedMotionProps}
              layout="position"
            >
              <UserSearchResult userId={userId} />
            </motion.div>
          ))}
          <LoadMoreForFeed
            triggerRef={ref}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </AnimatePresence>
      )}
    </div>
  );
}
