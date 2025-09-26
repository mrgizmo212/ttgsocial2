import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/queries/useUser.tsx";
import DisplayNameComponent from "../user/DisplayNameComponent.tsx";
import ProfilePic from "../user/ProfilePic.tsx";
import UsernameComponent from "../user/UsernameComponent.tsx";
import { UserHoverCardTrigger } from "../modal/hover_card/UserHoverCardTrigger.tsx";

export function UserSearchResult({ userId }: { userId: number }) {
  const { data: user } = useUser(userId);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (user) {
          navigate("/profile/" + user.id);
        }
      }}
      className="w-full flex gap-2 hover:cursor-pointer hover:bg-twitterTextAlt/20 items-center py-3 px-2"
    >
      <UserHoverCardTrigger userId={userId}>
        <div className="w-10 h-10">
          <ProfilePic userId={user?.id} />
        </div>
      </UserHoverCardTrigger>
      <div className="flex text-sm flex-col text-twitterTextAlt">
        <UserHoverCardTrigger userId={userId}>
          <div>
            <DisplayNameComponent
              customClassName="text-twitterText text-md font-bold"
              user={user}
            />
          </div>
        </UserHoverCardTrigger>
        <UserHoverCardTrigger userId={userId}>
          <div>
            <UsernameComponent user={user} />
          </div>
        </UserHoverCardTrigger>
      </div>
    </div>
  );
}
