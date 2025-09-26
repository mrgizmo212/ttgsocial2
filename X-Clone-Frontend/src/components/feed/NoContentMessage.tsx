import { useUser } from "../../hooks/queries/useUser.tsx";
import type { FeedType } from "../../types/FeedType.ts";

type NoContentYetProps = {
  tabType: FeedType;
  userId?: number;
};

export type NoContentYetMessageType = {};

export function NoContentMessage({ tabType, userId }: NoContentYetProps) {
  const { data: user } = useUser(userId ?? -1);

  const shouldShowUsername = () => {
    switch (tabType) {
      case "Bookmarks":
      case "Notifications":
      case "Following":
        return false;

      default:
        return true;
    }
  };

  const displayUser = shouldShowUsername() ? "@" + user?.username : "";

  function determineTabName() {
    switch (tabType) {
      case "Tweets":
        return "hasn't tweeted";
      case "Media":
        return "hasn't posted any media";
      case "Bookmarks":
        return "Save Tweets for later";
      case "Liked":
        return "hasn't liked any tweets";
      case "Notifications":
        return "Join the conversation";
      case "Replies":
        return "hasn't replied to any tweets";
      case "Following":
        return "Nothing to see here - yet";
    }
  }

  function determineSubMessage() {
    switch (tabType) {
      case "Tweets":
        return "Once they do, you'll find those posts here";
      case "Media":
        return "Once they do, you'll find those posts here";
      case "Bookmarks":
        return "Don't let the good ones fly away! Bookmark tweets to easily find them again in the future";
      case "Liked":
        return "Once they do, you'll find those posts here";
      case "Notifications":
        return "When someone on X interacts with your content, you'll find it here";
      case "Replies":
        return "Once they do, you'll find those posts here";
      case "Following":
        return "When you follow someone, their Tweets will show up here.";
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center my-4">
      <div className="h-auto w-2/3 flex flex-col gap-2 justify-center items-center">
        {false ? (
          <p className="text-twitterText text-center font-bold text-2xl">
            {determineTabName()}
          </p>
        ) : (
          tabType && (
            <>
              <img className="h-auto" src={`/images/no-${tabType}.png`} />
              <p className="text-twitterText text-center font-bold text-2xl">
                {displayUser} {determineTabName()}
              </p>
              <p className="text-twitterTextAlt text-center">
                {determineSubMessage()}
              </p>
            </>
          )
        )}
      </div>
    </div>
  );
}
