import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/queries/useUser.tsx";
import { useLocation } from "react-router-dom";

type ProfilePicComponentProps = {
  userId?: number;
  disableNavigation?: boolean;
  showForSample?: boolean;
};

function ProfilePic({
  userId,
  disableNavigation,
  showForSample,
}: ProfilePicComponentProps) {
  const { data: user } = useUser(userId);

  const location = useLocation();

  const navigate = useNavigate();
  const navigateToProfile = (e: React.MouseEvent<HTMLImageElement>): void => {
    if (userId && !disableNavigation) {
      e.stopPropagation();
      navigate("/profile/" + userId);
    }
  };

  const isTweetPage = location.pathname.startsWith("/tweet/");

  //TODO clean this up with the hover logic

  if (showForSample)
    return (
      <img
        onClick={(e) => navigateToProfile(e)}
        className={`h-full w-full rounded-full object-cover ${
          disableNavigation ? "" : "4opacity-75"
        }`}
        src={`https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg`}
      />
    );

  if (!userId) {
    return (
      <div className="w-full h-full rounded-full bg-gray-600 animate-pulse"></div>
    );
  }

  return (
    <>
      {user ? (
        <img
          onClick={(e) => navigateToProfile(e)}
          className={`h-full w-full rounded-full object-cover ${
            isTweetPage ? "hover:cursor-pointer" : ""
          } ${disableNavigation ? "" : "hover:opacity-75"}`}
          src={user.profilePictureUrl}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-600 animate-pulse"></div>
      )}
    </>
  );
}

export default ProfilePic;
