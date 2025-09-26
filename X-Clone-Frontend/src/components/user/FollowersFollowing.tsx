import type { User } from "../../types/User.ts";

type FollowersFollowingProps = {
  pageUser: User;
};

function FollowersFollowing({ pageUser }: FollowersFollowingProps) {
  return (
    <>
      <div className="flex text-twitterTextAlt">
        <p>
          <span className="font-bold text-twitterText">
            {pageUser.followers.length}
          </span>{" "}
          Followers
        </p>
      </div>
      <div className="flex text-twitterTextAlt">
        <p>
          <span className="font-bold text-twitterText">
            {pageUser.following.length}
          </span>{" "}
          Following
        </p>
      </div>
    </>
  );
}

export default FollowersFollowing;
