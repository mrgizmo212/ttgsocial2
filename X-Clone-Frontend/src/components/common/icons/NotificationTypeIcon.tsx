import type { ReactNode } from "react";
import type { NotificationType } from "../../../types/NotificationType.ts";
import { HeroIcon } from "./HeroIcon.tsx";

type NotificationTypeIconProps = {
  notificationType: NotificationType;
};

function NotificationTypeIcon({ notificationType }: NotificationTypeIconProps) {
  function decideIcon(nType: NotificationType): ReactNode {
    switch (nType) {
      case "like":
        return (
          <HeroIcon
            iconName="HeartIcon"
            solid={true}
            className="text-twitterRed w-7 h-7"
          />
        );
      case "follow":
        return (
          <HeroIcon
            iconName="UserIcon"
            solid={true}
            className="text-twitterBlue w-7 h-7"
          />
        );
      case "reply":
        return (
          <HeroIcon
            iconName="ChatBubbleOvalLeftIcon"
            solid={true}
            className="text-twitterBlue w-7 h-7"
          />
        );
      case "repost":
        return (
          <HeroIcon
            iconName="ArrowPathRoundedSquareIcon"
            solid={true}
            className="text-twitterGreen w-7 h-7"
          />
        );
    }

    return null;
  }

  const icon = decideIcon(notificationType);

  return <>{icon}</>;
}

export default NotificationTypeIcon;
