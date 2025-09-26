import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../constants/env.ts";
import type { User } from "../../types/User.ts";

export const usePinPost = (
  postId: number,
  { onUpdate }: { onUpdate?: (updatedUser: User) => void } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isPinned }: { isPinned: boolean }) => {
      const endpoint = isPinned ? "/api/posts/unpin" : "/api/posts/pin";
      const token = localStorage.getItem("jwt");

      console.log("Token is:" + token);
      console.log("isPinned is: " + isPinned);
      console.log("Post id is: " + postId);

      const res = await fetch(`${API_URL}${endpoint}?postId=${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Pin toggle failed");
      return (await res.json()) as User;
    },

    onSuccess: (updatedUser) => {
      onUpdate?.(updatedUser);
      console.log("Updated user: " + JSON.stringify(updatedUser));
      queryClient.setQueryData(["currentUser"], updatedUser);
      queryClient.setQueryData(["user", updatedUser.id], updatedUser);
    },

    onError: (err) => {
      console.error("Failed to toggle pin:", err);
    },
  });
};
