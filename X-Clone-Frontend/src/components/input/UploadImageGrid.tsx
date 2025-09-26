import { motion, AnimatePresence } from "framer-motion";
import cn from "clsx";
import type { FilesWithId } from "../../types/file.ts";

type Props = {
  images: FilesWithId;
  setImages: (images: FilesWithId) => void;
};

export function UploadImageGrid({ images, setImages }: Props) {
  const handleRemove = (targetId: string) => () => {
    const newImages = images.filter((image) => image.id !== targetId);
    setImages(newImages);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 grid-rows-auto gap-2 mt-4 rounded-2xl overflow-hidden",
        images.length === 1 && "grid-cols-1 grid-rows-1",
        images.length === 3 && "grid-rows-[1fr_1fr]"
      )}
    >
      <AnimatePresence mode="popLayout">
        {images.map((file, index) => {
          const url = URL.createObjectURL(file);

          return (
            <motion.div
              layout
              key={file.id}
              className="relative w-full h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={url}
                alt="preview"
                className={cn(
                  "w-full h-full object-cover",
                  images.length === 1 && "rounded-2xl",
                  images.length === 2 &&
                    ["rounded-l-2xl", "rounded-r-2xl"][index],
                  images.length === 3 &&
                    [
                      "row-span-2 rounded-l-2xl",
                      "rounded-tr-2xl",
                      "rounded-br-2xl",
                    ][index],
                  images.length === 4 &&
                    [
                      "rounded-tl-2xl",
                      "rounded-tr-2xl",
                      "rounded-bl-2xl",
                      "rounded-br-2xl",
                    ][index]
                )}
                onLoad={() => URL.revokeObjectURL(url)}
              />
              <div
                onClick={handleRemove(file.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-backgroundBlack/60 rounded-full flex items-center justify-center text-white text-xs cursor-pointer hover:bg-twitterBlack/80 transition"
              >
                ✕
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
