// removed FaXTwitter icon in favor of image logo
import DrawerNavigationPair from "../../modal/drawer/DrawerNavigationPair";
import { HeroIcon } from "../../common/icons/HeroIcon.tsx";
import { useModal } from "../../../context/ModalProvider.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useUnseenNotificationIds } from "../../../hooks/mutations/useSeenNotifications";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";

export function LeftDesktopLayout() {
  const { setModalType } = useModal();
  const { data: currentUser } = useCurrentUser();
  const location = useLocation();
  const { data: unseenIds = [] } = useUnseenNotificationIds();
  const navigate = useNavigate();

  return (
    <div className="hidden xl:flex items-end xl:flex-col xl:px-15 2xl:px-20 xl:w-2/3 py-3">
      <div className="flex h-fit flex-col py-2">
        <div className="flex justify-start mb-4">
          <img
            src="/icon-charts.png"
            alt="Logo"
            onClick={() => navigate("/")}
            className="h-10 w-10 hover:cursor-pointer"
          />
        </div>

        <DrawerNavigationPair name={"Home"} routePath="/">
          <HeroIcon
            iconName="HomeIcon"
            className="h-7 w-7"
            solid={location.pathname === `/`}
          />
        </DrawerNavigationPair>

        <DrawerNavigationPair name={"Explore"} routePath={`/explore`}>
          <HeroIcon
            iconName="MagnifyingGlassIcon"
            className="h-7 w-7"
            solid={location.pathname === `/explore`}
          />
        </DrawerNavigationPair>

        <DrawerNavigationPair name={"Notifications"} routePath="/notifications">
          <HeroIcon
            iconName="BellIcon"
            className="h-7 w-7"
            solid={location.pathname === `/notifications`}
          />
          {currentUser && unseenIds.length > 0 && (
            <div className="w-4 rounded-full h-4 absolute left-3 z-10 bg-(--color-main) top-3 right-9">
              {" "}
            </div>
          )}
        </DrawerNavigationPair>

        <DrawerNavigationPair name={"Bookmarks"} routePath="/bookmarks">
          <HeroIcon
            iconName="BookmarkIcon"
            className="h-7 w-7"
            solid={location.pathname === `/bookmarks`}
          />
        </DrawerNavigationPair>

        <DrawerNavigationPair name={"Messages"} routePath="/messages">
          <HeroIcon iconName="EnvelopeIcon" className="h-7 w-7" />
        </DrawerNavigationPair>

        <div
          onClick={() => setModalType("feedback")}
          className={`hover:cursor-pointer w-fit flex h-16 relative text-2xl  text-twitterText items-center gap-4`}
        >
          <HeroIcon
            iconName="ChatBubbleBottomCenterTextIcon"
            className="h-7 w-7"
            solid={false}
          />
          <p className={`font-bold md:font-medium`}>Feedback</p>
        </div>

        <DrawerNavigationPair name={"About"} routePath="/about">
          <HeroIcon
            iconName="QuestionMarkCircleIcon"
            className="h-7 w-7"
            solid={location.pathname === "/about"}
          />
        </DrawerNavigationPair>

        <a
          href="https://github.com/jokerhutt"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit h-16 relative text-2xl  text-twitterText items-center gap-4 hover:cursor-pointer"
        >
          <HeroIcon
            iconName="CodeBracketSquareIcon"
            className="h-7 w-7"
            solid={false}
          />
          <span className="font-bold md:font-medium">GitHub</span>
        </a>

        <DrawerNavigationPair
          name={"Profile"}
          routePath={`/profile/${currentUser?.id}`}
        >
          <HeroIcon
            iconName="UserIcon"
            className="h-7 w-7"
            solid={location.pathname === `/profile/${currentUser?.id}`}
          />
        </DrawerNavigationPair>

        <div onClick={() => setModalType("changeColor")}>
          <DrawerNavigationPair name={"Set Theme"}>
            <HeroIcon
              iconName="PaintBrushIcon"
              className="h-7 w-7"
              solid={false}
            />
          </DrawerNavigationPair>
        </div>

        {currentUser && (
          <DrawerNavigationPair name={"Log Out"}>
            <HeroIcon iconName="PowerIcon" className="h-7 w-7" solid={false} />
          </DrawerNavigationPair>
        )}

        {!currentUser && (
          <DrawerNavigationPair name={"Login / Register"}>
            <HeroIcon iconName="ArrowRightOnRectangleIcon" className="h-7 w-7" />
          </DrawerNavigationPair>
        )}
      </div>
    </div>
  );
}
