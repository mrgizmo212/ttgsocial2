import { useNavigate } from "react-router-dom";
import type { User } from "../../types/User.ts";

type UsernameComponentProps = {
  user?: User | null;
  disableNavigation?: boolean;
  truncate?: boolean;
  showForSample?: boolean;
};
function UsernameComponent({
  user,
  disableNavigation,
  showForSample,
}: UsernameComponentProps) {
  const navigate = useNavigate();

  const textToDisplay = user?.username;


  const hoverDisplay = !disableNavigation
    ? "hover:cursor-pointer truncate"
    : "truncate ";

  const navigateToProfile = (
    e: React.MouseEvent<HTMLParagraphElement>
  ): void => {
    if (user && !disableNavigation) {
      e.stopPropagation();
      navigate("/profile/" + user.id);
    }
  };

  if (showForSample) return <p>@X</p>;

  if (user) {
    return (
      <div className="flex gap-2">
        <p className={hoverDisplay} onClick={(e) => navigateToProfile(e)}>
          @{textToDisplay}
        </p>
      </div>
    );
  } else {
    return (
      <div className="w-18 h-2 bg-twitterTextAlt rounded-l-2xl rounded-r-2xl"></div>
    );
  }
}

export default UsernameComponent;
