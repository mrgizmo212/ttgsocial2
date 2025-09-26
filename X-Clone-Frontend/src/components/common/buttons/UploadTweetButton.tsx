import type { Post } from "../../../types/Post.ts";
import type { ModalType } from "../../../types/ModalType.ts";
import toast from "react-hot-toast";
import { useCreatePost } from "../../../hooks/mutations/useCreatePost.tsx";
import type { FilesWithId } from "../../../types/file.ts";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";

type UploadTweetButtonProps = {
  textInput: string;
  clearAllInput: () => void;
  parentId?: number;
  setNewPost?: (post: Post) => void;
  setToggle?: (modalType: ModalType) => void;
  filesWithId: FilesWithId;
  isPoll: boolean;
  pollChoices: string[];
  pollExpiry: number[];
};

function UploadTweetButton({
  clearAllInput,
  textInput,
  parentId,
  filesWithId,
  setToggle,
  isPoll,
  pollChoices,
  pollExpiry,
}: UploadTweetButtonProps) {
  const { data: currentUser } = useCurrentUser();

  const hasValidPollExpiry = pollExpiry.some((entry) => entry !== 0);
  const hasValidPoll = !pollChoices.some((choice) => choice == "");
  const enableButton =
    (textInput.length > 0 || (filesWithId.length > 0 && !parentId)) &&
    currentUser &&
    textInput.length < 181 &&
    (!isPoll || (hasValidPollExpiry && hasValidPoll));

  const createPost = currentUser
    ? useCreatePost(currentUser.id, parentId)
    : undefined;

  const handleToastClick = () => {
    if (!enableButton) {
      toast.error("Invalid input.");
      return;
    }

    toast.loading("Posting...");

    const formData = new FormData();
    formData.append("text", textInput);
    if (parentId !== undefined) {
      formData.append("parentId", parentId.toString());
    }

    if (isPoll) {
      pollChoices.forEach((choice) => {
        formData.append("pollChoices", choice);
      });
      pollExpiry.forEach((time) => {
        formData.append("pollExpiry", time.toString());
      });
    }

    filesWithId.forEach((file) => {
      formData.append("images", file);
    });

    if (!createPost) return;

    createPost.mutate(formData, {
      onSuccess: () => {
        clearAllInput();
        toast.dismiss();
        toast.success("Tweet posted!");
        if (setToggle) setToggle(null);
      },
      onError: () => {
        toast.dismiss();
        toast.error("Failed to post tweet.");
      },
    });
  };

  return (
    <div
      onClick={handleToastClick}
      className={`w-fit px-4 font-bold text-sm flex items-center justify-center rounded-2xl h-8 ${
        enableButton
          ? "bg-(--color-main) text-white hover:cursor-pointer"
          : "hover:cursor-not-allowed bg-(--color-main)/50"
      } text-twitterTextAlt`}
    >
      <p className="">Tweet</p>
    </div>
  );
}

export default UploadTweetButton;
