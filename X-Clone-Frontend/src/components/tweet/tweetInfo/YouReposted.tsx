import type { User } from "../../../types/User";
import { HeroIcon } from "../../common/icons/HeroIcon.tsx";

type YouRepostedProps = {
  reposter: User;
};

export function YouReposted({ reposter }: YouRepostedProps) {
  return (
    <>
      <div className="flex h-6 col-start-2 items-center gap-2 text-twitterTextAlt w-full">
        <HeroIcon iconName="ArrowPathRoundedSquareIcon" className="h-4 w-4" />
        <p className="text-sm">{reposter.username} Reposted</p>
      </div>
    </>
  );
}
