import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePost } from "../../../hooks/queries/usePost.tsx";
import { useDeletePost } from "../../../hooks/mutations/useDeletePost.tsx";
import { HeroIcon } from "../../common/icons/HeroIcon.tsx";
import { CustomDropdownItem } from "./CustomDropdownItem.tsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/queries/useUser.tsx";
import FollowButton from "../../common/buttons/FollowButton.tsx";
import { usePinPost } from "../../../hooks/mutations/usePinPost.tsx";
import { RiUnpinLine } from "react-icons/ri";
import { RiPushpinLine } from "react-icons/ri";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../../../types/User.ts";

type DropdownMenuContentProps = {
  postId: number;
  mainPost?: boolean;
  closeMenu: () => void;
};

export function DropdownMenuContent({
  postId,
  mainPost,
  closeMenu,
}: DropdownMenuContentProps) {
  const queryClient = useQueryClient(); // ← add this

  const { data: currentUser } = useCurrentUser();
  const { data: post } = usePost(postId);
  const isOwnPost = post?.userId == currentUser?.id;
  const { data: pageUser } = useUser(post?.userId);
  if (!post) return null;
  const deletePost = useDeletePost(currentUser?.id, post.parentId);
  const pinPost = usePinPost(postId);
  const navigate = useNavigate();

  const isPinned = currentUser?.pinnedPostId == postId;

  const handleDeletePost = () => {
    deletePost?.mutate(postId);
    closeMenu();
    if (mainPost) {
      const isInternalReferrer = document.referrer.startsWith(
        window.location.origin
      );
      if (isInternalReferrer) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  const pinToProfile = async () => {
    // ensure we use the freshest current user we have cached
    const me = queryClient.getQueryData<User>(["currentUser"]) ?? currentUser;
    if (!post || !me) return;
    if (post.userId !== me.id) return; // do not call API if not owner
    pinPost.mutate({ isPinned });
  };

  return (
    <DropdownMenu.Content
      className="z-50 min-w-46 animate-hover-card rounded-md bg-(--background-main) border border-twitterBorder shadow-[0_0_5px_1px_gray] p-1"
      sideOffset={5}
      align="end"
    >
      {isOwnPost ? (
        <>
          <CustomDropdownItem
            customClassName="text-red-500"
            text="Delete"
            handleDropdownMutation={handleDeletePost}
          >
            <HeroIcon iconName="TrashIcon" className="h-4 w-4" />
          </CustomDropdownItem>
          <CustomDropdownItem
            customClassName="text-twitterText"
            text={`${isPinned ? "Unpin from" : "Pin to"} your profile`}
            handleDropdownMutation={pinToProfile}
          >
            {isPinned ? (
              <RiUnpinLine className="text-md" />
            ) : (
              <RiPushpinLine className="text-md" />
            )}
          </CustomDropdownItem>
        </>
      ) : (
        <DropdownMenu.Item className="text-twitterText px-3 py-2 text-sm focus:outline-none focus-visible:outline-none items-center gap-2 flex hover:bg-twitterTextAlt/20 rounded cursor-pointer">
          <FollowButton pageUser={pageUser} closeModal={closeMenu}>
            <div className="flex items-center gap-2">
              <HeroIcon iconName="UserPlusIcon" className="h-4 w-4" />
              {currentUser && pageUser?.followers.includes(currentUser.id) ? (
                <p>unfollow @{pageUser.username}</p>
              ) : (
                <p>follow @{pageUser?.username}</p>
              )}
            </div>
          </FollowButton>
        </DropdownMenu.Item>
      )}
    </DropdownMenu.Content>
  );
}
