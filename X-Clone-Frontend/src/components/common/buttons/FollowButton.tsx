import type { User } from "../../../types/User.ts";
import { useFollowUser } from "../../../hooks/mutations/useFollowUser.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../context/ModalProvider.tsx";
import type { ReactNode } from "react";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";

type FollowButtonProps = {
  pageUser?: User | null;
  children: ReactNode;
  closeModal?: () => void;
};

function FollowButton({ pageUser, children, closeModal }: FollowButtonProps) {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const { setModalType } = useModal();

  const isFollowing =
    pageUser?.followers.includes(currentUser?.id ?? -1) ?? false;
  const canFollow = !!currentUser;

  const followMutation = useFollowUser(currentUser?.id, pageUser?.id, {
    onUpdate: (updatedFollowed) => {
      const followerId = currentUser?.id;
      const viewedId = pageUser?.id;
      if (!followerId || !viewedId) return;

      const isNowFollowing = updatedFollowed.followers.includes(followerId);

      queryClient.setQueryData<User>(["currentUser"], (prev) => {
        if (!prev) return prev;
        const already = prev.following.includes(viewedId);
        const following = isNowFollowing
          ? already
            ? prev.following
            : [...prev.following, viewedId]
          : prev.following.filter((id) => id !== viewedId);
        return { ...prev, following };
      });

      queryClient.setQueryData<User>(["user", followerId], (prev) => {
        if (!prev) return prev;
        const already = prev.following.includes(viewedId);
        const following = isNowFollowing
          ? already
            ? prev.following
            : [...prev.following, viewedId]
          : prev.following.filter((id) => id !== viewedId);
        return { ...prev, following };
      });

      if (!isNowFollowing) {
        queryClient.invalidateQueries({
          queryKey: ["feed", "following", followerId],
        });
      }
    },
  });

  const handleFollow = () => {
    if (!pageUser || followMutation.isPending) return;
    if (canFollow) {
      followMutation.mutate({ currentlyFollowing: isFollowing });
      if (closeModal) {
        closeModal();
      }
    } else {
      if (closeModal) {
        closeModal();
      }
      setModalType("signup");
    }
  };

  if (!pageUser) return null;

  return (
    <div
      className="h-fit"
      onClick={(e) => {
        e.stopPropagation();
        handleFollow();
      }}
      style={{
        cursor: followMutation.isPending ? "not-allowed" : "pointer",
        opacity: followMutation.isPending ? 0.5 : 1,
      }}
    >
      {children}
    </div>
  );
}

export default FollowButton;
