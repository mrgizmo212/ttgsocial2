import { BsPinFill } from "react-icons/bs";

export function Pinned() {
  return (
    <>
      <div className="flex h-6 col-start-2 items-center gap-2 text-twitterTextAlt w-full">
        <BsPinFill className="text-sm flex items-center" />
        <p className="text-sm font-bold">Pinned</p>
      </div>
    </>
  );
}
