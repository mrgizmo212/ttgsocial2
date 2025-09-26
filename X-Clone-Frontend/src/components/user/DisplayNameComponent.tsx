import { useNavigate } from "react-router-dom";
import type { User } from "../../types/User.ts";
import { VerifiedImage } from "./VerifiedImage.tsx";

type DisplayNameComponentProps = {
  user?: User | null;
  disableNavigation?: boolean;
  customClassName?: string;
  truncate?: boolean;
  showForSample?: boolean;
};

function DisplayNameComponent({
  user,
  customClassName,
  disableNavigation,
  showForSample,
}: DisplayNameComponentProps) {
  const navigate = useNavigate();

  const navigateToProfile = (
    e: React.MouseEvent<HTMLParagraphElement>
  ): void => {
    if (user && !disableNavigation) {
      e.stopPropagation();
      navigate("/profile/" + user.id);
    }
  };

  const isVerified = user?.verified;

  const customClass = customClassName ? customClassName : "";
  const hoverDisplay = !disableNavigation
    ? " hover:cursor-pointer truncate hover:underline "
    : "truncate";

  const textToDisplay = user?.displayName;

  if (showForSample)
    return <p className={hoverDisplay + " " + customClass}>X</p>;

  if (user && user.displayName) {
    return (
      <div className="flex gap-1 items-center">
        <p
          className={hoverDisplay + " " + customClass}
          onClick={(e) => navigateToProfile(e)}
        >
          {textToDisplay}
        </p>
        {isVerified && <VerifiedImage/>}
      </div>
    );
  } else if (user) {
    return null;
  } else {
    return (
      <div className="w-18 h-2 bg-twitterTextAlt truncate rounded-l-2xl rounded-r-2xl"></div>
    );
  }
}

export default DisplayNameComponent;
