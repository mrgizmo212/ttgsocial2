import ProfilePic from "../user/ProfilePic.tsx";
import { useNavigate } from "react-router-dom";
import DisplayNameComponent from "../user/DisplayNameComponent.tsx";
import NotificationTypeIcon from "../common/icons/NotificationTypeIcon.tsx";
import { useUser } from "../../hooks/queries/useUser.tsx";
import { useNotification } from "../../hooks/queries/useNotification.tsx";
import { UserHoverCardTrigger } from "../modal/hover_card/UserHoverCardTrigger.tsx";
type NotificationTemplateProps = {
  notificationId: number;
  isTempUnseen?: boolean;
};

function Notification({
  notificationId,
  isTempUnseen,
}: NotificationTemplateProps) {
  const navigate = useNavigate();
  const { data: notification } = useNotification(notificationId);
  const displayMessage = determineDisplayMessage();

  const { data: sender } = useUser(notification?.senderId ?? -1);

  function determineDisplayMessage(): string {
    switch (notification?.type) {
      case "like":
        return "liked your post";

      case "follow":
        return "followed you";

      case "repost":
        return "reposted your post";

      case "reply":
        return "replied to your post";
    }

    return "";
  }

  function navigateFromNotification() {
    if (!notification) return;
    if (notification.type == "follow") {
      navigate("/profile/" + notification.senderId);
    } else {
      navigate("/tweet/" + notification.referenceId);
    }
  }

  return (
    <div>
      {notification && (
        <div
          className={`h-fit w-full flex border-b hover:bg-twitterTextAlt/20 hover:cursor-pointer border-twitterBorder ${
            isTempUnseen ? "bg-twitterTextAlt/20" : " "
          }`}
          onClick={() => navigateFromNotification()}
        >
          <div className="w-18 h-fit flex justify-center text-3xl pt-4 text-center">
            <NotificationTypeIcon notificationType={notification.type} />
          </div>

          <div className="flex flex-col w-full h-fit pr-4 pt-3">
            <div className="w-full h-fit">
              <div className="flex w-12 pb-1">
                {sender && (
                  <UserHoverCardTrigger userId={sender.id}>
                    <div className={"w-12 h-12"}>
                      <ProfilePic userId={sender?.id} />
                    </div>
                  </UserHoverCardTrigger>
                )}
              </div>
            </div>

            <div className="pb-3 w-full h-fit">
              <div className="w-full h-fit flex-col">
                <div className="w-full h-5 flex gap-1 align-middle text-white mb-0.5">
                  {sender && (
                    <UserHoverCardTrigger userId={sender.id}>
                      <div className="font-bold">
                        <DisplayNameComponent user={sender} />
                      </div>
                    </UserHoverCardTrigger>
                  )}
                  <p onClick={() => navigateFromNotification()}>
                    {" "}
                    {displayMessage}
                  </p>
                </div>

                <div className="text-twitterTextAlt max-h-32">
                  <p onClick={() => navigateFromNotification()}>
                    {notification.text.slice(0, 30)}
                    {notification.text.length > 30 ? "..." : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
