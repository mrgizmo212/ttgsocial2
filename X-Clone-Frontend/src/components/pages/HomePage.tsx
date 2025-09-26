import { useContext, useEffect, useMemo, useState } from "react";
import TabList from "./TabList.tsx";
import Feed from "../feed/Feed.tsx";
import { HeaderContentContext } from "../../context/HeaderContentProvider.tsx";
import { useInfiniteFeed } from "../../hooks/queries/useInfiniteFeed.tsx";
import type { FeedType } from "../../types/FeedType.ts";
import ComposeTweet from "../input/ComposeTweet.tsx";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";

function HomePage() {
  const tabs: FeedType[] = ["For You", "Following"];
  const [activeTab, setActiveTab] = useState<FeedType>("For You");
  const { data: currentUser } = useCurrentUser();
  const { setHeaderContent } = useContext(HeaderContentContext);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFeed(activeTab, currentUser?.id);

  const postIds = useMemo(() => {
    const seen = new Set<number>();
    return (
      data?.pages.flatMap((page) =>
        page.posts.filter((id) => {
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
      ) ?? []
    );
  }, [data]);

  useEffect(() => {
    setHeaderContent(null);
  }, []);

  return (
    <div className="h-full w-full flex flex-col overflow-x-wrap xl:border-x border-twitterBorder">
      {currentUser && (
        <div className="h-fit">
          <TabList
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
      <div className="h-full flex flex-col grow w-full scrollbar-blue overflow-y-auto">
        {currentUser && (
          <div className="hidden xl:flex xl:w-full">
            <ComposeTweet />
          </div>
        )}
        <Feed
          tabType={activeTab}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          key={activeTab}
          postIdsArray={postIds}
        />
      </div>
    </div>
  );
}

export default HomePage;
