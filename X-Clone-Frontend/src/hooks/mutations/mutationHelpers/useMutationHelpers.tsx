import { QueryClient } from "@tanstack/react-query";
import type { User } from "../../../types/User.ts";
import type { Post } from "../../../types/Post.ts";

export function getLikeOnUpdate(
  postId: number,
  currentUserId: number | undefined,
  queryClient: QueryClient
) {
  return (updatedPost: Post) => {
    const isNowLiked = updatedPost.likedBy.includes(currentUserId ?? -1);

    queryClient.setQueryData<User>(["currentUser"], (prev) => {
      if (!prev) return prev;

      const alreadyThere = prev.likedPosts.includes(postId);
      const likedPosts = isNowLiked
        ? alreadyThere
          ? prev.likedPosts
          : [...prev.likedPosts, postId]
        : prev.likedPosts.filter((id) => id !== postId);

      return { ...prev, likedPosts };
    });
  };
}

export function getBookmarkOnUpdate(
  postId: number,
  currentUserId: number | undefined,
  queryClient: QueryClient
) {
  return (updatedPost: Post) => {
    const isNowBookmarked = updatedPost.bookmarkedBy.includes(
      currentUserId ?? -1
    );

    queryClient.setQueryData<User>(["currentUser"], (prev) => {
      if (!prev) return prev;

      const alreadyThere = prev.bookmarkedPosts.includes(postId);
      const bookmarkedPosts = isNowBookmarked
        ? alreadyThere
          ? prev.bookmarkedPosts
          : [...prev.bookmarkedPosts, postId]
        : prev.bookmarkedPosts.filter((id) => id !== postId);

      return { ...prev, bookmarkedPosts };
    });

    if (!isNowBookmarked) {
      queryClient.invalidateQueries({
        queryKey: ["feed", "bookmarks", currentUserId],
      });
    }
  };
}

export function getRepostOnUpdate(
  postId: number,
  currentUserId: number | undefined,
  queryClient: QueryClient
) {
  return (updatedPost: Post) => {
    const isNowRetweeted = updatedPost.retweetedBy.includes(
      currentUserId ?? -1
    );

    queryClient.setQueryData<User>(["currentUser"], (prev) => {
      if (!prev) return prev;

      const alreadyThere = prev.retweets.includes(postId);
      const retweetedPosts = isNowRetweeted
        ? alreadyThere
          ? prev.retweets
          : [...prev.retweets, postId]
        : prev.retweets.filter((id) => id !== postId);

      return { ...prev, retweetedPosts };
    });
  };
}
