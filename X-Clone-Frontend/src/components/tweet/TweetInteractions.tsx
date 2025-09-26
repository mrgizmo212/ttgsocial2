import InteractionButton from "../common/buttons/InteractionButton.tsx";
import { useModal } from "../../context/ModalProvider.tsx";
import { useLikePost } from "../../hooks/mutations/useLikePost.tsx";
import { useBookmarkPost } from "../../hooks/mutations/useBookmarkPost.tsx";
import { useRepostPost } from "../../hooks/mutations/useRepostPost.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { usePost } from "../../hooks/queries/usePost.tsx";
import {
  getBookmarkOnUpdate,
  getLikeOnUpdate,
  getRepostOnUpdate,
} from "../../hooks/mutations/mutationHelpers/useMutationHelpers.tsx";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";
type PostInteractionComponentProps = {
  postId: number;
  showPadding?: boolean;
};

function TweetInteractions({
  postId,
  showPadding,
}: PostInteractionComponentProps) {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const { setModalType, setModalData } = useModal();
  const { data: post } = usePost(postId);

  const likeList = post?.likedBy ?? [];
  const bookmarkList = post?.bookmarkedBy ?? [];
  const replyList = post?.replies ?? [];
  const retweetedByList = post?.retweetedBy ?? [];

  const isLiked = likeList?.includes(currentUser?.id ?? -1);
  const isBookmarked = bookmarkList?.includes(currentUser?.id ?? -1);
  const isRetweeted = retweetedByList?.includes(currentUser?.id ?? -1);

  const likeMutation = useLikePost(postId, currentUser?.id, {
    onUpdate: getLikeOnUpdate(postId, currentUser?.id, queryClient),
  });

  const bookmarkMutation = useBookmarkPost(postId, currentUser?.id, {
    onUpdate: getBookmarkOnUpdate(postId, currentUser?.id, queryClient),
  });

  const repostMutation = useRepostPost(postId, currentUser?.id, {
    onUpdate: getRepostOnUpdate(postId, currentUser?.id, queryClient),
  });

  useEffect(() => {
    if (postId == 14) {
      console.log("Curruser is now: " + currentUser);
    }
  }, [postId, currentUser]);

  const handleReplyModal = () => {
    if (!postId) return;
    setModalType("replying");
    setModalData({ mainId: postId });
  };

  return (
    <>
      <div
        className={`h-fit text-twitterTextAlt w-full flex items-center border-twitterBorder py-3 align-middle ${
          showPadding ? " justify-around border-y my-4" : " justify-between"
        }`}
      >
        <InteractionButton
          iconName="ChatBubbleOvalLeftIcon"
          buttonColor="notAColor"
          numberList={replyList}
          mutationFunction={handleReplyModal}
        />

        <InteractionButton
          iconName="ArrowPathRoundedSquareIcon"
          buttonColor="twitterGreen"
          numberList={retweetedByList}
          mutationFunction={() => repostMutation.mutate({ isRetweeted })}
        />

        <InteractionButton
          iconName="HeartIcon"
          buttonColor="twitterRed"
          numberList={likeList}
          mutationFunction={() => likeMutation.mutate({ isLiked })}
        />

        <InteractionButton
          iconName="BookmarkIcon"
          buttonColor="twitterBlue"
          numberList={bookmarkList}
          mutationFunction={() => bookmarkMutation.mutate({ isBookmarked })}
        />
      </div>
    </>
  );
}

export default TweetInteractions;
