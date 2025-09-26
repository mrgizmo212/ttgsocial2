import type { PollExpiryTimes } from "../../types/PollExpiryTimes";

type PollExpiryFieldProps = {
  choiceName: PollExpiryTimes;
  selectedTime: number;
  setTime: (time: number, type: PollExpiryTimes) => void;
  timeLimit: number;
};

export function PollExpiryField({
  choiceName,
  setTime,
  timeLimit,
  selectedTime,
}: PollExpiryFieldProps) {
  return (
    <div className="flex w-full flex-col">
      <label className="text-twitterTextAlt font-bold pl-1 capitalize">
        {choiceName}
      </label>
      <div className="relative w-full">
        <select
          value={selectedTime}
          onChange={(e) => setTime(Number(e.target.value), choiceName)}
          className="w-full appearance-none border border-twitterBorder rounded-xl bg-transparent text-twitterText h-12 pl-4 pr-16 focus:border-[--color-main] focus:outline-none"
        >
          {[...Array(timeLimit + 1)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-twitterTextAlt pointer-events-none text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
