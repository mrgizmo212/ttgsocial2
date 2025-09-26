import LoadingIcon from "../common/icons/LoadingIcon.tsx";
import Notification from "../tweet/Notification.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { NoContentMessage } from "./NoContentMessage.tsx";

type NotificationFeedProps = {
  tempUnreads?: number[];
  notificationIds: number[];
  isLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

function NotificationFeed({
  tempUnreads,
  notificationIds,
  isLoading,
}: NotificationFeedProps) {
  return (
    <div className="w-full">
      {!isLoading && notificationIds.length < 1 ? (
        <NoContentMessage tabType="Notifications" />
      ) : !isLoading ? (
        <AnimatePresence>
          <div className="flex flex-col w-full">
            {notificationIds.map((id) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                layout
              >
                <Notification
                  isTempUnseen={tempUnreads?.includes(id)}
                  notificationId={id}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="flex justify-center py-2 flex-col w-full">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}

export default NotificationFeed;
