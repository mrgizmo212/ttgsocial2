import type { Post } from "../../../types/Post.ts";

type PostTextComponentProps = {
  post?: Post | null;
};

function PostTextComponent({ post }: PostTextComponentProps) {
  if (post) {
    return <p>{post.text}</p>;
  } else {
    return (
      <>
        <div className="flex flex-col w-full py-1 gap-2">
          <div className="w-full h-2 bg-twitterTextAlt text-twitterBlue rounded-l-2xl rounded-r-2xl"></div>
          <div className="w-full h-2 bg-twitterTextAlt rounded-l-2xl rounded-r-2xl"></div>
          <div className="w-full h-2 bg-twitterTextAlt rounded-l-2xl rounded-r-2xl"></div>
        </div>
      </>
    );
  }
}

export default PostTextComponent;
