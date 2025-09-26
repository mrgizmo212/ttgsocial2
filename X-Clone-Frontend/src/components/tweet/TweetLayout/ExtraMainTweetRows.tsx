import type { Post } from "../../../types/Post";
import type { User } from "../../../types/User";

type ExtraMainTweetRowsProps = {
  post: Post;
  postUser?: User;
};

export function ExtraMainTweetRows({ post }: ExtraMainTweetRowsProps) {
  return (
    <>
      <div className="pl-2 col-span-2 flex flex-col gap-2 my-2 whitespace-pre-line break-words text-xl">
        <p className="">{post.text}</p>
      </div>
    </>
  );
}
