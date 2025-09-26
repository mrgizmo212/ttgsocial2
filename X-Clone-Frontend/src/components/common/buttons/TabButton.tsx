import type { FC } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FeedType } from "../../../types/FeedType.ts";

interface TabButtonProps {
  tab: FeedType;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<FeedType>>;
}

const TabButton: FC<TabButtonProps> = ({ tab, setActiveTab, activeTab }) => {

  

  return (
    <div
      onClick={() => setActiveTab(tab)}
      className={
        "hover:cursor-pointer hover:bg-twitterTextAlt/20 w-full h-12 flex items-center justify-center "
      }
    >
      <p
        className={`h-12 text-twitterText font-semibold flex justify-center items-center text-center ${
          tab == activeTab
            ? "border-(--color-main) border-b-2"
            : "text-twitterTextAlt"
        }`}
      >
        {tab}
      </p>
    </div>
  );
};

export default TabButton;
