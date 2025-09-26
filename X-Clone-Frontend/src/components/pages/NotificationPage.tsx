import { useContext, useEffect, useMemo, useState } from "react";
import NotificationFeed from "../feed/NotificationFeed.tsx";
import { HeaderContentContext } from "../../context/HeaderContentProvider.tsx";
import { useInfiniteFeed } from "../../hooks/queries/useInfiniteFeed.tsx";
import { useUnseenNotificationIds } from "../../hooks/mutations/useSeenNotifications.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";

function NotificationPage() {
  const { data: currentUser } = useCurrentUser();
  const { setHeaderContent } = useContext(HeaderContentContext);

  const { data: unseenIds = [] } = useUnseenNotificationIds();
  const [tempUnread, setTempUnread] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const setTempUnreadsAndMarkNotificationsAsSeen = () => {
    if (unseenIds && unseenIds.length > 0) {
      setTempUnread(unseenIds);
      queryClient.invalidateQueries({ queryKey: ["unseenNotifications"] });
    }
  };

  useEffect(() => {
    setTempUnreadsAndMarkNotificationsAsSeen();
  }, [unseenIds]);

  useEffect(() => {
    setHeaderContent("Notifications");
  }, []);

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFeed("Notifications", currentUser?.id);

  const notificationIds = useMemo(() => {
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

  return (
    <div className="flex flex-col h-full w-full flex-grow xl:border-x border-twitterBorder scrollbar-blue overflow-y-auto">
      <div className="mb-14">
        <NotificationFeed
          tempUnreads={tempUnread}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          notificationIds={notificationIds}
        />
      </div>
    </div>
  );
}

export default NotificationPage;
