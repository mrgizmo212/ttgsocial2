import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import type { FeedType } from "../../types/FeedType.ts";
import { API_URL } from "../../constants/env.ts";

export type FeedPage = {
  posts: number[];
  nextCursor: number | null;
};

export const useInfiniteFeed = (type: FeedType, userId?: number) => {
  return useInfiniteQuery<
    FeedPage,
    Error,
    InfiniteData<FeedPage>,
    [string, FeedType, number?],
    number
  >({
    queryKey: ["feed", type, userId],
    queryFn: async ({ pageParam = 0 }) => {
      const url = new URL(`${API_URL}/api/feed/get-feed-page`);
      url.searchParams.set("type", type);
      url.searchParams.set("cursor", pageParam.toString());
      url.searchParams.set("limit", "10");
      if (userId !== undefined) {
        url.searchParams.set("userId", userId.toString());
      }

      const token = localStorage.getItem("jwt");
      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch paginated post IDs");

      const response = await res.json();
      console.log("INFINITE PAGE RES: ", response);
      return response;
    },
    initialPageParam: !!userId && type == "For You" ? 0 : Date.now() + 60_000,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60,
  });
};
