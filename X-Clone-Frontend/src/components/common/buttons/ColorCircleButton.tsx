import type { ThemeType } from "../../../types/ThemeType.ts";

type ColorCircleButtonProps = {
  color: ThemeType;
  currentColor: ThemeType;
  setCurrentTheme: (color: ThemeType) => void;
};

function ColorCircleButton({
  color,
  currentColor,
  setCurrentTheme,
}: ColorCircleButtonProps) {

  const isCurrentlySelectedColor = currentColor == color;

  return (
    <>
      {isCurrentlySelectedColor ? (
        <div
          style={{ backgroundColor: `${color}` }}
          className="w-12 hover:cursor-pointer h-12 rounded-full border border-twitterTextAlt"
        ></div>
      ) : (
        <div
          onClick={() => setCurrentTheme(color)}
          style={{ backgroundColor: `${color}` }}
          className="w-12 h-12 hover:cursor-pointer rounded-full border-(--color-main)"
        ></div>
      )}
    </>
  );
}

export default ColorCircleButton;
