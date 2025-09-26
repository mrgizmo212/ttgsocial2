import { useContext, useEffect } from "react";
import Feed from "../feed/Feed.tsx";
import { HeaderContentContext } from "../../context/HeaderContentProvider.tsx";
import { useInfiniteFeed } from "../../hooks/queries/useInfiniteFeed.tsx";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";

function BookmarkPage() {
  const { data: currentUser } = useCurrentUser();
  const { setHeaderContent } = useContext(HeaderContentContext);

  useEffect(() => {
    setHeaderContent(<p>Bookmarks</p>);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteFeed("Bookmarks", currentUser?.id);

  const postIds = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="h-full w-full overflow-hidden">
      {currentUser && (
        <div className="h-full flex grow w-full overflow-y-auto scrollbar-blue xl:border-x border-twitterBorder">
          <Feed
            tabType="Bookmarks"
            postIdsArray={postIds}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      )}
    </div>
  );
}

export default BookmarkPage;
