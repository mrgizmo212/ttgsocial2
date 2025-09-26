import { useEffect } from "react";
import { usePollChoices } from "../../hooks/queries/usePollChoices";
import { HeroIcon } from "../common/icons/HeroIcon";
import { useHasVoted } from "../../hooks/queries/useHasVoted";
import { useVoteOnPoll } from "../../hooks/mutations/useVoteOnPoll";
import type { Post } from "../../types/Post";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";

type PollProps = {
  pollId: number;
  post: Post;
};

export function Poll({ pollId, post }: PollProps) {
  const { data: pollChoices } = usePollChoices(pollId);
  const { data: hasVoted } = useHasVoted(pollId);
  const { data: currentUser } = useCurrentUser();
  const hasAlreadyVoted = hasVoted && hasVoted != -1;
  const voteMutation = useVoteOnPoll(pollId);

  const isPollExpired = post.pollExpiryTimeStamp
    ? new Date(post.pollExpiryTimeStamp).getTime() <= Date.now()
    : false;

  const timeRemainingMs = post.pollExpiryTimeStamp
    ? new Date(post.pollExpiryTimeStamp).getTime() - Date.now()
    : 0;

  let timeRemaining = "";

  if (timeRemainingMs <= 0) {
    timeRemaining = "Final Results";
  } else if (timeRemainingMs < 60 * 60 * 1000) {
    const minutes = Math.floor(timeRemainingMs / (60 * 1000));
    timeRemaining = `${minutes}m left`;
  } else if (timeRemainingMs < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(timeRemainingMs / (60 * 60 * 1000));
    timeRemaining = `${hours}h left`;
  } else {
    const days = Math.floor(timeRemainingMs / (24 * 60 * 60 * 1000));
    timeRemaining = `${days}d left`;
  }

  const handleVote = (choiceId: number) => {
    if (!currentUser || hasAlreadyVoted) return;
    voteMutation.mutate({ choiceId });
  };

  const totalVotes = pollChoices?.reduce((sum, c) => sum + c.voteCount, 0);

  useEffect(() => {
    console.log("Poll id is: " + [pollId]);
    if (pollChoices) {
      console.log(JSON.stringify(pollChoices));
    }
  }, [pollChoices]);

  return (
    <div
      onClick={(e) => {
        if (!hasAlreadyVoted) {
          e.stopPropagation();
        }
      }}
    >
      <div className="flex flex-col h-full w-full justify-center gap-2 my-2">
        {pollChoices &&
          (() => {
            return pollChoices.map((choice) => {
              const percent =
                totalVotes && totalVotes > 0
                  ? Math.round((choice.voteCount / totalVotes) * 100)
                  : 0;

              return hasAlreadyVoted || isPollExpired ? (
                <div
                  key={choice.id}
                  className="relative w-full text-sm rounded-xl overflow-hidden  h-12 px-4 flex items-center"
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-twitterText opacity-20"
                    style={{ width: `${percent}%` }}
                  />

                  <div className="flex text-sm text-twitterText w-full justify-between items-center relative">
                    <div className="flex gap-2 items-center">
                      <p>{choice.choice}</p>
                      {hasVoted === choice.id && (
                        <HeroIcon
                          iconName="CheckCircleIcon"
                          className="w-4 h-4"
                        />
                      )}
                    </div>
                    <p className="">{percent}%</p>
                  </div>
                </div>
              ) : (
                <div
                  key={choice.id}
                  onClick={() => handleVote(choice.id)}
                  className="w-full border-2 border-(--color-main) text-sm rounded-4xl h-12 px-4 flex items-center hover:bg-twitterBlue/10 cursor-pointer"
                >
                  <p>{choice.choice}</p>
                </div>
              );
            });
          })()}

        <div className="w-full text-twitterTextAlt">
          <p>
            {totalVotes} Votes ·{" "}
            {isPollExpired ? "Final Results" : timeRemaining}
          </p>
        </div>
      </div>

      <div></div>
    </div>
  );
}
