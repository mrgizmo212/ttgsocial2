import { HeroIcon } from "../common/icons/HeroIcon";

type PollChoiceFieldProps = {
  choice: string;
  index: number;
  canAddChoice: (index: number) => boolean;
  handleChoiceChange: (index: number, value: string) => void;
  addChoice: () => void;
};

export function PollChoiceField({
  choice,
  index,
  canAddChoice,
  addChoice,
  handleChoiceChange,
}: PollChoiceFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="pl-1 text-twitterTextAlt font-bold">Choice {index + 1}</p>
      <div className="w-full flex gap-2 items-center">
        <input
          value={choice}
          maxLength={20}
          onChange={(e) => handleChoiceChange(index, e.target.value)}
          className={`w-full text-twitterText border ${
            choice.length < 20
              ? "border-twitterBorder focus:border-(--color-main)"
              : "border-red-500"
          } bo focus:outline-none  focus:ring-0 rounded-xl px-2 h-12`}
        />
        <div className="w-16 flex items-center justify-center">
          {canAddChoice(index) && (
            <div onClick={() => addChoice()}>
              <HeroIcon
                iconName="PlusIcon"
                className="w-8 hover:cursor-pointer h-8 text-(--color-main)"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
