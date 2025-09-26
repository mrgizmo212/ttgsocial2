import CreatedAtDisplay from "../common/CreatedAtDisplay";

type TweetCreatedAgoProps = {
  open: boolean;
  createdAt?: string;
};

export function TweetCreatedAgo({ open, createdAt }: TweetCreatedAgoProps) {
  
    if (!open || !createdAt) return;
  
    return (
    <div className="flex-shrink-0 pt-0.5 text-twitterTextAlt text-sm whitespace-nowrap flex gap-1">
      <p>•</p>
      <CreatedAtDisplay createdAt={createdAt} typeOfCreatedAt="timeago" />
    </div>
  );
}
