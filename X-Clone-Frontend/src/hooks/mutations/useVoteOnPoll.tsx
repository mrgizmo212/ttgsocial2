import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../constants/env.ts";
import type { PollChoice } from "../../types/PollChoice.ts";

export const useVoteOnPoll = (
  pollId: number,
  { onUpdate }: { onUpdate?: (updatedPollChoices: PollChoice[]) => void } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ choiceId }: { choiceId: number }) => {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`${API_URL}/api/polls/submit-vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pollId, choiceId }),
      });

      if (!res.ok) throw new Error("Vote failed");
      return await res.json();
    },

    onMutate: async ({ choiceId }) => {
      await queryClient.cancelQueries({ queryKey: ["poll_votes", pollId] });
      queryClient.setQueryData(["poll_votes", pollId], choiceId);
      return { choiceId };
    },

    onError: () => {
      queryClient.setQueryData(["poll_votes", pollId], null);
    },

    onSuccess: (updatedPollChoices) => {
      onUpdate?.(updatedPollChoices);
      queryClient.invalidateQueries({ queryKey: ["poll_choices", pollId] });
      queryClient.invalidateQueries({ queryKey: ["poll_votes", pollId] });
    },
  });
};
