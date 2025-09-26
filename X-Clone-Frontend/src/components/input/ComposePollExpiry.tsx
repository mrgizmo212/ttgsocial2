import { PollExpiryField } from "./PollExpiryField";
import type { PollExpiryTimes } from "../../types/PollExpiryTimes";

type ComposePollExpiryProps = {
  pollExpiry: number[];
  setPollExpiry: (newExpiry: number[]) => void;
};

export function ComposePollExpiry({
  pollExpiry,
  setPollExpiry,
}: ComposePollExpiryProps) {
  function getExpiryTimeIndex(expiryTimeType: PollExpiryTimes) {
    switch (expiryTimeType) {
      case "Days":
        return 0;
      case "Hours":
        return 1;
      case "Minutes":
        return 2;
    }
  }

  function setTimeForExpiry(time: number, type: PollExpiryTimes) {
    const indexToUpdate = getExpiryTimeIndex(type);
    const updated = [...pollExpiry];
    updated[indexToUpdate] = time;
    setPollExpiry(updated);
  }

  return (
    <div className="w-full flex gap-4 justify-between mb-4">
      <PollExpiryField
        choiceName="Days"
        timeLimit={7}
        setTime={setTimeForExpiry}
        selectedTime={pollExpiry[getExpiryTimeIndex("Days")]}
      />
      <PollExpiryField
        choiceName="Hours"
        timeLimit={23}
        setTime={setTimeForExpiry}
        selectedTime={pollExpiry[getExpiryTimeIndex("Hours")]}
      />
      <PollExpiryField
        choiceName="Minutes"
        timeLimit={59}
        setTime={setTimeForExpiry}
        selectedTime={pollExpiry[getExpiryTimeIndex("Minutes")]}
      />
    </div>
  );
}
