import type { User } from "../../../types/User.ts";
import { PostLine } from "./PostLine.tsx";

type ReplyingToProps = {
  parentId?: number;
  postUser?: User;
};

export function ReplyingTo({ postUser }: ReplyingToProps) {
  return (
    <>
      <PostLine showLine={true} />
      <div className={`text-sm text-twitterTextAlt`}>
        <p>
          Replying to{" "}
          <span className="text-(--color-main)">@{postUser?.username}</span>
        </p>
      </div>
    </>
  );
}
