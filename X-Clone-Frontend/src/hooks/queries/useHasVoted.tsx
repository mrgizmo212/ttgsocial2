import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../constants/env";

export const useHasVoted = (pollId: number) => {

  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  return useQuery<number>({
    queryKey: ["poll_votes", pollId, Boolean(token)],
    enabled: !!token && pollId > 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/polls/${pollId}/getPollVote`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch poll vote");
      return res.json();
    },
  });
};
