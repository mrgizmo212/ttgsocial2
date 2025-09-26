import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../types/Post.ts";
import { API_URL } from "../../constants/env.ts";
import { updateFirstPageFeed } from "./mutationHelpers/updateFirstPageFeed.tsx";

export const useLikePost = (
  postId: number,
  currentUserId: number | undefined,
  { onUpdate }: { onUpdate?: (updatedPost: Post) => void } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      const url = isLiked ? "/api/likes/delete" : "/api/likes/create";

      const token = localStorage.getItem("jwt");

      const res = await fetch(`${API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ likedPostId: postId }),
      });

      if (!res.ok) throw new Error("Like toggle failed");
      return await res.json();
    },

    onMutate: async ({ isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const previous = queryClient.getQueryData<Post>(["post", postId]);
      if (!previous) return { previous: null };

      const newLikedBy = isLiked
        ? previous.likedBy.filter((id) => id !== currentUserId)
        : [...previous.likedBy, currentUserId!];

      const optimisticPost: Post = {
        ...previous,
        likedBy: newLikedBy,
      };

      queryClient.setQueryData(["post", postId], optimisticPost);

      if (currentUserId) {
        updateFirstPageFeed({
          queryClient,
          action: "Liked",
          currentUserId,
          postId,
          isRemoving: isLiked,
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["post", postId], context.previous);
      }
    },

    onSuccess: (updatedPost) => {
      onUpdate?.(updatedPost);
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
