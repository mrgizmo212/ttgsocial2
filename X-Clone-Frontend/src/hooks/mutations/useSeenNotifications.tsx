import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../constants/env.ts";

export const useUnseenNotificationIds = () => {
  return useQuery<number[]>({
    queryKey: ["unseenNotifications"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/notifications/get-unseen`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch unseen notifications");
      return res.json();
    },
    enabled: !!localStorage.getItem("jwt"),
    staleTime: 1000 * 30,
  });
};
