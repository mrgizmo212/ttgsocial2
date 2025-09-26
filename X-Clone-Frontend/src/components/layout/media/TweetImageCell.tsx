import { motion } from "framer-motion";
import { TweetImage } from "./TweetImage.tsx";
import type { PostMedia } from "../../../types/PostMedia.ts";

type MediaItemProps = {
  media: PostMedia;
  index: number;
  total: number;
  handleClick?: (e: React.MouseEvent<HTMLDivElement>, id: number) => void;
};

export function TweetImageCell({
  media,
  index,
  total,
  handleClick,
}: MediaItemProps) {
  const roundedClass =
    total === 1
      ? "rounded-2xl"
      : total === 2
      ? ["rounded-l-2xl", "rounded-r-2xl"][index]
      : total === 3
      ? ["row-span-2 rounded-l-2xl", "rounded-tr-2xl", "rounded-br-2xl"][index]
      : [
          "rounded-tl-2xl",
          "rounded-tr-2xl",
          "rounded-bl-2xl",
          "rounded-br-2xl",
        ][index];

  return (
    <motion.div
      onClick={(e) => (handleClick ? handleClick(e, media.id) : null)}
      layout
      key={media.id}
      className="relative w-full h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.25 }}
    >
      <TweetImage url={media.url} roundedClass={roundedClass} />
    </motion.div>
  );
}
