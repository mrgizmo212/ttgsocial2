import { FaRegImage } from "react-icons/fa6";
import { useRef } from "react";
import type { FilesWithId } from "../../../types/file.ts";

type Props = {
  imagesInput: FilesWithId;
  setImagesInput: (files: FilesWithId) => void;
  isPoll: boolean;
};

export function ImageUploadButton({
  imagesInput,
  setImagesInput,
  isPoll,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isPoll) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map((file) => {
      return Object.assign(file, { id: crypto.randomUUID() });
    });

    const merged = [...imagesInput, ...newFiles].slice(0, 4);

    setImagesInput(merged);
    e.target.value = "";
  };

  return (
    <>
      <FaRegImage
        onClick={handleClick}
        className={`${
          isPoll
            ? "opacity-50 hover:cursor-not-allowed"
            : "hover:cursor-pointer"
        }`}
      />
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={inputRef}
        onChange={handleChange}
      />
    </>
  );
}
