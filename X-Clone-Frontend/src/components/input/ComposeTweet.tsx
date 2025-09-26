import ProfilePic from "../user/ProfilePic.tsx";
import TextareaAutosize from "react-textarea-autosize";
import { MdOutlineGif } from "react-icons/md";
import UploadTweetButton from "../common/buttons/UploadTweetButton.tsx";
import { useState } from "react";
import type { ModalType } from "../../types/ModalType.ts";
import { ImageUploadButton } from "../common/buttons/ImageUploadButton.tsx";
import { UploadImageGrid } from "./UploadImageGrid.tsx";
import type { FilesWithId } from "../../types/file.ts";
import Tweet from "../tweet/Tweet.tsx";
import { CharsLeftCircle } from "../common/CharsLeftCircle.tsx";
import { FaListUl } from "react-icons/fa";
import { ComposePoll } from "./ComposePoll.tsx";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";

type ComposeTweetProps = {
  parentId?: number;
  setToggle?: (modalType: ModalType) => void;
  showParentPreview?: boolean;
};

function ComposeTweet({
  parentId,
  setToggle,
  showParentPreview,
}: ComposeTweetProps) {
  const [textInput, setTextInput] = useState<string>("");
  const { data: currentUser } = useCurrentUser();
  const [imagesInput, setImagesInput] = useState<FilesWithId>([]);
  const isModal = setToggle != null;
  const placeHolder = parentId ? "Tweet your reply" : "What's up?!";
  const [isPoll, setIsPoll] = useState(false);
  const [pollChoices, setPollChoices] = useState<string[]>(["", ""]);
  const [pollExpiry, setPollExpiry] = useState<number[]>([1, 0, 0]);

  const clearAllInput = () => {
    setTextInput("");
    setImagesInput([]);
    setPollChoices(["", ""]);
    setPollExpiry([1, 0, 0]);
    setIsPoll(false);
  };

  return (
    <div
      className={`flex flex-col pt-4 pb-4 bg-(--background-main) w-full ${
        isModal
          ? "rounded-2xl overflow-y-auto scrollbar-none max-h-[calc(100dvh-8rem)] border border-(--color-main)"
          : "border-b border-gray-700"
      }`}
    >
      {showParentPreview && parentId && (
        <Tweet postId={parentId} isModal={true} isParentPost={true} />
      )}

      <div
        className={`grid px-4 grid-cols-[auto_1fr] gap-x-3 w-full ${
          parentId && showParentPreview ? "py-2" : ""
        }`}
      >
        <div className="w-12 h-12 cursor-pointer">
          <ProfilePic userId={currentUser?.id} />
        </div>
        <div className="flex flex-col w-full h-fit">
          <div className="w-full h-fit flex">
            <TextareaAutosize
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full resize-none min-h-12 p-1 focus:outline-none focus:ring-0 focus:border-transparent text-white placeholder:text-twitterTextAlt"
              placeholder={placeHolder}
            />
          </div>

          {isPoll ? (
            <div className="w-full h-auto ">
              <ComposePoll
                pollExpiry={pollExpiry}
                setPollExpiry={setPollExpiry}
                setIsPoll={setIsPoll}
                pollChoices={pollChoices}
                setPollChoices={setPollChoices}
              />
            </div>
          ) : (
            imagesInput.length > 0 &&
            !isPoll && (
              <div className="w-full h-auto ">
                <UploadImageGrid
                  images={imagesInput}
                  setImages={setImagesInput}
                />
              </div>
            )
          )}

          <div className="flex w-full h-10 items-center">
            <div className="flex gap-2 pl-2 items-center text-(--color-main) h-full w-full">
              <ImageUploadButton
                isPoll={isPoll}
                imagesInput={imagesInput}
                setImagesInput={setImagesInput}
              />
              <MdOutlineGif className="text-4xl hover:cursor-not-allowed" />
              <FaListUl
                onClick={() => {
                  if (!(imagesInput.length > 0)) {
                    setIsPoll(!isPoll);
                  }
                }}
                className={`text-sm ${
                  !(imagesInput.length > 0)
                    ? "hover:cursor-pointer"
                    : "opacity-50 hover:cursor-not-allowed"
                }`}
              />
            </div>
            <div className="w-full h-full justify-end flex gap-2 items-center">
              {textInput.length > 0 && (
                <CharsLeftCircle charsLeft={180 - textInput.length} />
              )}
              <UploadTweetButton
                clearAllInput={clearAllInput}
                filesWithId={imagesInput}
                isPoll={isPoll}
                pollExpiry={pollExpiry}
                pollChoices={pollChoices}
                setToggle={setToggle}
                textInput={textInput}
                parentId={parentId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComposeTweet;
