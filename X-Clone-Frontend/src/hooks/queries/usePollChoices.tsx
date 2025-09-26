import { useQuery } from "@tanstack/react-query";
import type { PollChoice } from "../../types/PollChoice";
import { API_URL } from "../../constants/env";

export const usePollChoices = (pollId: number) =>
  useQuery<PollChoice[]>({
    queryKey: ["poll_choices", pollId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/polls/${pollId}/choices`);
      if (!response.ok) throw new Error("Failed to fetch unseen notifications");
      return response.json();
    },
    enabled: typeof pollId === "number" && pollId > 0,
    staleTime: 1000 * 60 * 5,
  });
