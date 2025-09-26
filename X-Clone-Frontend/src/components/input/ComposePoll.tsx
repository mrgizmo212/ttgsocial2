import { ComposePollExpiry } from "./ComposePollExpiry";
import { PollChoiceField } from "./PollChoiceField";

type ComposePollProps = {
  pollChoices: string[];
  setPollChoices: React.Dispatch<React.SetStateAction<string[]>>;
  setIsPoll: React.Dispatch<React.SetStateAction<boolean>>;
  pollExpiry: number[];
  setPollExpiry: (newExpiry: number[]) => void;
};

export function ComposePoll({
  setIsPoll,
  pollChoices,
  setPollChoices,
  pollExpiry,
  setPollExpiry,
}: ComposePollProps) {
  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...pollChoices];
    updated[index] = value;
    setPollChoices(updated);
  };

  const addChoice = () => {
    setPollChoices((prev) => [...prev, ""]);
  };

  const canAddChoice = (index: number): boolean =>
    pollChoices.length < 4 && index == pollChoices.length - 1;

  return (
    <div className="w-full h-full flex flex-col gap-2 px-4 pt-4 border border-twitterBorder rounded-2xl mb-4">
      <div className="flex flex-col w-full gap-4 mb-4">
        {pollChoices.map((choice, index) => (
          <PollChoiceField
            choice={choice}
            index={index}
            canAddChoice={canAddChoice}
            addChoice={addChoice}
            handleChoiceChange={handleChoiceChange}
          />
        ))}
      </div>

      <hr className="text-twitterBorder" />

      <ComposePollExpiry
        pollExpiry={pollExpiry}
        setPollExpiry={setPollExpiry}
      />

      <hr className="text-twitterBorder" />

      <div
        onClick={() => {
          setIsPoll(false);
          setPollChoices(["", ""]);
        }}
        className={`hover:cursor-pointer text-red-500 flex items-center gap-2 justify-center h-10 rounded-full`}
      >
        <p className="">Remove Poll</p>
      </div>

      <div></div>
    </div>
  );
}
