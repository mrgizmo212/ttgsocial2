import ComposePostMobileButton from "../common/buttons/ComposePostMobileButton.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { HeroIcon } from "../common/icons/HeroIcon.tsx";
import { useUnseenNotificationIds } from "../../hooks/mutations/useSeenNotifications.tsx";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";
import { useModal } from "../../context/ModalProvider.tsx";

function FooterBar() {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const location = useLocation();
  const { data: unseenIds = [] } = useUnseenNotificationIds();
  const {setModalType} = useModal();
  
  return (
    <>
      <div className="h-14 w-full bg-(--background-main) text-2xl text-white border-t border-t-twitterBorder flex items-center justify-around">
        <div className="w-full h-full flex items-center justify-center">
          <div onClick={() => navigate("/")}>
            <HeroIcon
              iconName="HomeIcon"
              className="w-7 h-7"
              solid={location.pathname === `/`}
            />
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div onClick={() => navigate("/explore")}>
            <HeroIcon
              iconName="MagnifyingGlassIcon"
              className="w-7 h-7"
              solid={location.pathname === `/explore`}
            />
          </div>
        </div>
        <div className="w-full h-full flex relative items-center justify-center">
          <div
            onClick={() => (currentUser ? navigate("/notifications") : setModalType("signup"))}
          >
            <HeroIcon
              iconName="BellIcon"
              className="w-7 h-7"
              solid={location.pathname === `/notifications`}
            />
          </div>
          {currentUser && unseenIds.length > 0 && (
            <div className="w-4 rounded-full h-4 absolute z-10 bg-(--color-main) top-2 right-9">
              {" "}
            </div>
          )}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <HeroIcon
            iconName="EnvelopeIcon"
            className="w-7 h-7"
            solid={location.pathname === `/messages`}
          />
        </div>

        {currentUser && <ComposePostMobileButton />}
      </div>
    </>
  );
}

export default FooterBar;
