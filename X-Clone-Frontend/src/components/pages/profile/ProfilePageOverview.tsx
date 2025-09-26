import { useEffect, useState } from "react";
import FollowersFollowing from "../../user/FollowersFollowing.tsx";
import ProfilePic from "../../user/ProfilePic.tsx";
import { FaRegCalendar } from "react-icons/fa6";
import type { User } from "../../../types/User.ts";
import BannerComponent from "../../user/BannerComponent.tsx";
import UsernameComponent from "../../user/UsernameComponent.tsx";
import DisplayNameComponent from "../../user/DisplayNameComponent.tsx";
import BioComponent from "../../user/BioComponent.tsx";
import LoadingIcon from "../../common/icons/LoadingIcon.tsx";
import CreatedAtDisplay from "../../common/CreatedAtDisplay.tsx";
import FollowButton from "../../common/buttons/FollowButton.tsx";
import { useModal } from "../../../context/ModalProvider.tsx";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";
type ProfilePageOverviewProps = {
  pageUser?: User | null;
};

function ProfilePageOverview({ pageUser }: ProfilePageOverviewProps) {
  const { data: currentUser } = useCurrentUser();
  const [isOwnPage, setIsOwnPage] = useState(false);
  const { setModalType } = useModal();

  useEffect(() => {
    setIsOwnPage(!!(currentUser && pageUser && currentUser.id === pageUser.id));
  }, [pageUser, currentUser]);

  if (pageUser) {
    return (
      <div className="h-fit">
        <div className="w-full h-40 relative">
          <div className="opacity-100 h-32 w-full">
            <BannerComponent userId={pageUser.id} />
          </div>

          <div className="absolute w-20 h-20 left-3 bottom-0 rounded-full">
            <ProfilePic disableNavigation={true} userId={pageUser.id} />
          </div>

          <div className="w-full h-12 flex justify-end items-center px-4">
            <div className="w-28 hover:cursor-pointer h-auto flex items-center justify-center align-middle rounded-2xl border border-twitterText text-twitterText">
              {isOwnPage ? (
                <p className="font-bold" onClick={() => setModalType("editProfile")}>
                  Edit Profile
                </p>
              ) : (
                <FollowButton pageUser={pageUser}>
                  {pageUser?.followers.includes(currentUser?.id ?? -1) ? (
                    <p>Unfollow</p>
                  ) : (
                    <p>Follow</p>
                  )}
                </FollowButton>
              )}
            </div>
          </div>
        </div>

        <div className="w-full h-full mt-3 px-4 text-twitterText flex flex-col">
          <div className="w-full h-12 mb-2 flex flex-col">
            <div className="font-bold text-xl w-fit text-twitterText">
              <DisplayNameComponent user={pageUser} />
            </div>
            <div className="text-twitterTextAlt w-fit">
              <UsernameComponent user={pageUser} />
            </div>
          </div>

          <div className="flex w-full h-fit gap-2 flex-col">
            <div className="text-twitterText">
              <BioComponent user={pageUser} />
            </div>

            <div className="h-fit w-full text-twitterTextAlt">
              <div className="flex items-center gap-2">
                <FaRegCalendar />
                <CreatedAtDisplay
                  typeOfCreatedAt="date"
                  createdAt={pageUser.createdAt}
                />
              </div>
            </div>

            <div className="h-fit w-full flex items-center gap-4 mb-0.5 text-twitterTextAlt">
              <FollowersFollowing pageUser={pageUser} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-80 flex items-center">
        <LoadingIcon />
      </div>
    );
  }
}

export default ProfilePageOverview;
