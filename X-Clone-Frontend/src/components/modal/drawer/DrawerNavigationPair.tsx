import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import { useModal } from "../../../context/ModalProvider";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser";
import { useLogout } from "../../../hooks/auth/useLogout";

type DrawerNavigationPairProps = {
  children: ReactNode;
  name: string;
  routePath?: string;
  setDrawerOpen?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
};

function DrawerNavigationPair({
  children,
  name,
  routePath,
  disabled,
  setDrawerOpen,
}: DrawerNavigationPairProps) {
  const { setModalType } = useModal();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();

  const logout = useLogout();

  const onlyOnUserId = () => {
    switch (name) {
      case "Bookmarks":
      case "Notifications":
      case "Profile":
        return true;

      default:
        return false;
    }
  };

  const canNavigateAsUser = !onlyOnUserId() || currentUser;

  const handleNavigation = () => {
    if (disabled) return;

    if (name == "Log Out" && canNavigateAsUser) {
      logout();
    } else if (routePath && canNavigateAsUser) {
      navigate(routePath);
    } else {
      setModalType("signup");
    }

    setTimeout(() => {
      if (setDrawerOpen) {
        setDrawerOpen(false);
      }
    }, 50);
  };

  return (
    <div
      onClick={() => handleNavigation()}
      className={`${
        !disabled ? "hover:cursor-pointer" : "hover:cursor-not-allowed"
      } flex h-16 w-fit relative text-2xl  text-twitterText items-center gap-4`}
    >
      <div className="text-3xl">{children}</div>
      <div onClick={() => handleNavigation()}>
        <p className={`font-bold md:font-medium`}>{name}</p>
      </div>
    </div>
  );
}

export default DrawerNavigationPair;
