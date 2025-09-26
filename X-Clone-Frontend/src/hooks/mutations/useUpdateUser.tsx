import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../constants/env.ts";
import type { User } from "../../types/User.ts";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData): Promise<User> => {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      const updatedUser = await res.json();
      return updatedUser;
    },

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      queryClient.setQueryData(["user", updatedUser.id], updatedUser);
    },
  });
};
