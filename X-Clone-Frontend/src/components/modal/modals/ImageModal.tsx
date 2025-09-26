import { useEffect, useState } from "react";
import type { ModalType } from "../../../types/ModalType.ts";
import { TweetImage } from "../../layout/media/TweetImage.tsx";
import { HeroIcon } from "../../common/icons/HeroIcon.tsx";
import { AnimatePresence, motion } from "framer-motion";
import type { PostMedia } from "../../../types/PostMedia.ts";

type ImageModalProps = {
  setToggle: (modalType: ModalType) => void;
  mediaId: number;
  mediaList: PostMedia[];
};

function ImageModal({ mediaId, mediaList }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(
    mediaList.findIndex((media) => media.id === mediaId)
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (
        e.key === "ArrowRight" &&
        currentIndex < mediaList.length - 1
      ) {
        setCurrentIndex((prev) => prev + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, mediaList.length]);

  return (
    <div className="rounded-xl relative flex justify-center items-center w-full h-full">
      {currentIndex > 0 && (
        <div
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="absolute h-12 w-12 rounded-full hover:cursor-pointer hover:bg-twitterText/30 left-4 flex justify-center items-center"
        >
          <HeroIcon iconName="ArrowLeftIcon" className="w-6 h-6 text-white" />
        </div>
      )}

      <div className="flex justify-center items-center py-2 px-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mediaList[currentIndex].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TweetImage
              url={mediaList[currentIndex].url}
              roundedClass="rounded-2xl"
              isModal={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {currentIndex < mediaList.length - 1 && (
        <div
          onClick={() => setCurrentIndex((prev) => prev + 1)}
          className="absolute h-12 w-12 rounded-full hover:cursor-pointer hover:bg-twitterText/30 right-4 flex justify-center items-center"
        >
          <HeroIcon iconName="ArrowRightIcon" className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}

export default ImageModal;
