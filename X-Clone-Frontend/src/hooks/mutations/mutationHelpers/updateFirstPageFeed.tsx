import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { FeedPage } from "../../queries/useInfiniteFeed.tsx";

type FeedUpdateParams = {
  queryClient: QueryClient;
  action: string;
  currentUserId: number;
  postId: number;
  isRemoving: boolean;
};

export function updateFirstPageFeed({
  queryClient,
  action,
  currentUserId,
  postId,
  isRemoving,
}: FeedUpdateParams) {
  const feedKey = ["feed", action, currentUserId];
  const previousFeed =
    queryClient.getQueryData<InfiniteData<FeedPage>>(feedKey);

  if (!previousFeed) return;

  const newPages = [...previousFeed.pages];
  const firstPage = newPages[0];

  const updatedFirstPage: FeedPage = {
    ...firstPage,
    posts: isRemoving
      ? firstPage.posts.filter((id) => id !== postId)
      : [postId, ...firstPage.posts],
  };

  newPages[0] = updatedFirstPage;

  queryClient.setQueryData<InfiniteData<FeedPage>>(feedKey, {
    ...previousFeed,
    pages: newPages,
  });
}
