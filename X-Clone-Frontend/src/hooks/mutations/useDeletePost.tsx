import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../constants/env.ts";
import { updateFirstPageFeed } from "./mutationHelpers/updateFirstPageFeed.tsx";

export const useDeletePost = (
  currentUserId: number | undefined,
  parentId?: number
) => {
  if (!currentUserId) return;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number): Promise<number> => {
      const token = localStorage.getItem("jwt");
      console.log("Deleting post");
      const res = await fetch(`${API_URL}/api/posts/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(postId),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }

      return postId;
    },

    onSuccess: (deletedPostId) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      const isReply = !!parentId;

      if (isReply) {
        queryClient.invalidateQueries({ queryKey: ["post", parentId] });

        updateFirstPageFeed({
          queryClient,
          action: "Replies",
          currentUserId,
          postId: deletedPostId,
          isRemoving: true,
        });
      } else {
        ["For You", "Tweets"].forEach((feedType) => {
          updateFirstPageFeed({
            queryClient,
            action: feedType,
            currentUserId,
            postId: deletedPostId,
            isRemoving: true,
          });
        });
      }
    },

    onError: (error) => {
      console.error("Failed to delete post:", error.message);
    },
  });
};
