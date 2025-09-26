import {
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { HeaderContentContext } from "../../context/HeaderContentProvider.tsx";
import { ExploreSearchBar } from "../input/ExploreSearchBar.tsx";
import { useUserSearch } from "../../hooks/queries/useUserSearch.tsx";
import { useDebounce } from "@uidotdev/usehooks";
import LoadingIcon from "../common/icons/LoadingIcon.tsx";
import { useInfiniteUsers } from "../../hooks/queries/useInfiniteUserFeed.tsx";

import { UserSearchFeed } from "../feed/UserSearchFeed.tsx";

function ExplorePage() {
  const { setHeaderContent, headerContent } = useContext(HeaderContentContext);

  const [input, setInput] = useState("");
  const debouncedQuery = useDebounce(input, 300);

  const { data: userIds = [], isLoading } = useUserSearch(debouncedQuery);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUsers,
  } = useInfiniteUsers();

  const discoverIds = useMemo(() => {
    const seen = new Set<number>();
    return (
      data?.pages.flatMap((page) =>
        page.users.filter((id) => {
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
      ) ?? []
    );
  }, [data]);

  useEffect(() => {
    if (isValidElement(headerContent)) {
      const element = headerContent as ReactElement<any>;
      if (element.props.children === "Explore") return;
    }

    setHeaderContent(<p>Explore</p>);
  }, []);

  return (
    <div className="h-full w-full flex flex-col p-4 gap-4 xl:border-x border-twitterBorder scrollbar-blue overflow-hidden">
      <div className="w-full h-12 flex items-center justify-center">
        <ExploreSearchBar query={input} setQuery={setInput} />
      </div>
      <div className="overflow-y-auto w-full h-full flex flex-col">
        {input.length < 1 && discoverIds ? (
          <UserSearchFeed
            isInfinite={true}
            idsToLoad={discoverIds}
            isLoadingUsers={isLoadingUsers}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : isLoading ? (
          <LoadingIcon />
        ) : userIds && userIds.length <= 0 && !isLoading ? (
          <p className="text-white w-full text-center font-bold text-lg">
            No Results
          </p>
        ) : (
          <UserSearchFeed idsToLoad={userIds} />
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
