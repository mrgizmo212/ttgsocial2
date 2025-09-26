import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/queries/useUser.tsx";
import ProfilePic from "../../user/ProfilePic.tsx";
import FollowButton from "../../common/buttons/FollowButton.tsx";
import DisplayNameComponent from "../../user/DisplayNameComponent.tsx";
import UsernameComponent from "../../user/UsernameComponent.tsx";
import FollowersFollowing from "../../user/FollowersFollowing.tsx";
import { useModal } from "../../../context/ModalProvider.tsx";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";

type Props = {
  userId: number;
};

export function UserHoverCard({ userId }: Props) {
  const { data: tooltipUser } = useUser(userId);

  const [isOwnPage, setIsOwnPage] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { setModalType } = useModal();

  useEffect(() => {
    setIsOwnPage(
      !!(currentUser && tooltipUser && currentUser.id === tooltipUser.id)
    );
  }, [tooltipUser, currentUser]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col gap-3 p-4 bg-main-background shadow-md rounded-2xl w-full"
    >
      <div className="w-full h-auto flex flex-col gap-1 relative">
        <div className="w-full flex items-center justify-between">
          <div className="w-12 h-12 hover:cursor-pointer">
            <ProfilePic userId={tooltipUser?.id} />
          </div>
          <div className="w-28 hover:cursor-pointer h-fit py-0.5 flex items-center justify-center align-middle rounded-2xl border border-twitterText text-twitterText">
            {isOwnPage ? (
              <p onClick={() => setModalType("createAccount")}>Edit Profile</p>
            ) : (
              <FollowButton pageUser={tooltipUser}>
                {tooltipUser?.followers.includes(currentUser?.id ?? -1) ? (
                  <p>Unfollow</p>
                ) : (
                  <p>Follow</p>
                )}
              </FollowButton>
            )}
          </div>
        </div>

        <div className="w-full pl-1 flex flex-col text-twitterText">
          <div>
            <DisplayNameComponent user={tooltipUser} />
          </div>
          <div>
            <UsernameComponent user={tooltipUser} />
          </div>
        </div>

        <div className="w-full pl-1 flex gap-2">
          {tooltipUser && <FollowersFollowing pageUser={tooltipUser} />}
        </div>
      </div>
    </div>
  );
}
