import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../types/User.ts";
import { API_URL } from "../../constants/env.ts";

type FollowParams = { currentlyFollowing: boolean };

export const useFollowUser = (
  followerId: number | undefined,
  followedId: number | undefined,
  { onUpdate }: { onUpdate?: (updatedFollowed: User) => void } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currentlyFollowing }: FollowParams): Promise<User> => {
      if (followerId == null || followedId == null)
        throw new Error("Missing user IDs");

      const endpoint = currentlyFollowing ? "unfollow" : "follow";

      const token = localStorage.getItem("jwt");

      const res = await fetch(`${API_URL}/api/follows/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ followedId }),
      });

      if (!res.ok) throw new Error("Follow toggle failed");

      return await res.json();
    },

    onMutate: async ({ currentlyFollowing }) => {
      await queryClient.cancelQueries({ queryKey: ["user", followedId] });

      const previous = queryClient.getQueryData<User>(["user", followedId]);
      if (!previous) return { previous: null };

      const newFollowers = currentlyFollowing
        ? previous.followers.filter((id) => id !== followerId)
        : [...previous.followers, followerId!];

      const optimisticFollowed: User = {
        ...previous,
        followers: newFollowers,
      };

      queryClient.setQueryData(["user", followedId], optimisticFollowed);
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["user", followedId], context.previous);
      }
    },

    onSuccess: (updatedFollowed) => {
      queryClient.setQueryData<User>(
        ["user", updatedFollowed.id],
        updatedFollowed
      );
      onUpdate?.(updatedFollowed);

      queryClient.invalidateQueries({
        queryKey: ["feed", "Following", followerId],
      });
      queryClient.invalidateQueries({ queryKey: ["user", followedId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
