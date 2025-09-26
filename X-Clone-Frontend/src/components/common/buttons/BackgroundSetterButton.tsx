import type { BackgroundType } from "../../../types/BackgroundType.ts";

type BackgroundSetterButtonProps = {
  color: BackgroundType;
  currentColor: BackgroundType;
  setCurrentBackground: (color: BackgroundType) => void;
  name: string;
};

function BackgroundSetterButton({
  color,
  currentColor,
  setCurrentBackground,
  name,
}: BackgroundSetterButtonProps) {
  return (
    <>
      {currentColor == color ? (
        <div
          style={{ backgroundColor: `${color}` }}
          className="h-10 hover:cursor-pointer w-1/2 flex justify-center items-center text-lg border rounded-xl border-(--color-main)"
        >
          <p className="text-white">{name}</p>
        </div>
      ) : (
        <div
          onClick={() => setCurrentBackground(color)}
          style={{ backgroundColor: `${color}` }}
          className="h-10 w-1/2 hover:cursor-pointer flex justify-center items-center text-lg border rounded-xl border-twitterTextAlt"
        >
          <p className="text-white">{name}</p>
        </div>
      )}
    </>
  );
}

export default BackgroundSetterButton;
