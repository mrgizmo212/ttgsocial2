import { AnimatePresence } from "framer-motion";
import { TweetImageCell } from "./TweetImageCell.tsx";
import cn from "clsx";
import { useModal } from "../../../context/ModalProvider.tsx";
import type { PostMedia } from "../../../types/PostMedia.ts";

type ImagePreviewGridProps = {
  media: PostMedia[];
  postId?: number;
};

export function TweetImageGrid({ media }: ImagePreviewGridProps) {
  const total = media.length;

  const { setModalData, setModalType } = useModal();

  function handlePostClick(e: React.MouseEvent<HTMLDivElement>, id: number) {
    e.stopPropagation();
    setModalData({ mainId: id, auxiliaryId: media });
    setModalType("imagepreview");
  }

  const gridHeightClass = total === 1 ? "h-36" : "h-36";
  const gridCols = total === 1 ? "grid-cols-2" : "grid-cols-2";
  const gridRows = total <= 2 ? "grid-rows-1" : "grid-rows-2";

  return (
    <>
      <div className={cn("w-full my-2 max-w-[400px]", gridHeightClass)}>
        <div
          className={cn(
            "grid w-full h-full gap-2 overflow-hidden rounded-2xl",
            gridCols,
            gridRows
          )}
        >
          <AnimatePresence mode="popLayout">
            {media.map((m, index) => (
              <TweetImageCell
                key={m.id}
                media={m}
                index={index}
                total={total}
                handleClick={handlePostClick}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
