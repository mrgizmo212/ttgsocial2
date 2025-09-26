import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../types/Post.ts";
import { API_URL } from "../../constants/env.ts";
import { updateFirstPageFeed } from "./mutationHelpers/updateFirstPageFeed.tsx";

export const useRepostPost = (
  postId: number,
  currentUserId: number | undefined,
  { onUpdate }: { onUpdate?: (updatedPost: Post) => void } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isRetweeted }: { isRetweeted: boolean }) => {
      const url = isRetweeted ? "/api/retweets/delete" : "/api/retweets/create";

      const token = localStorage.getItem("jwt");

      //TODO add reply retweets
      const res = await fetch(`${API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          retweeterId: currentUserId,
          referenceId: postId,
          type: "post",
        }),
      });

      if (!res.ok) throw new Error("Repost request failed");
      return await res.json();
    },

    onMutate: async ({ isRetweeted }) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const previous = queryClient.getQueryData<Post>(["post", postId]);
      if (!previous) return { previous: null };

      const newRetweetedBy = isRetweeted
        ? previous.retweetedBy.filter((id) => id !== currentUserId)
        : [...previous.retweetedBy, currentUserId!];

      const optimisticPost: Post = {
        ...previous,
        retweetedBy: newRetweetedBy,
      };

      queryClient.setQueryData(["post", postId], optimisticPost);

      if (currentUserId && optimisticPost?.userId !== currentUserId) {
        updateFirstPageFeed({
          queryClient,
          action: "Tweets",
          currentUserId,
          postId: postId,
          isRemoving: isRetweeted,
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["post", postId], context.previous);
      }
    },

    onSuccess: (updatedPost: Post) => {
      onUpdate?.(updatedPost);
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["user", currentUserId] });
    },
  });
};
