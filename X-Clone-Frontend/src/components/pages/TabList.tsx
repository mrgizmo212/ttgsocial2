import type { FC } from "react";
import TabButton from "../common/buttons/TabButton.tsx";
import type { Dispatch, SetStateAction } from "react";
import type { FeedType } from "../../types/FeedType.ts";

interface TabListProps {
  tabs: FeedType[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<FeedType>>;
}

const TabList: FC<TabListProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full overflow-y-hidden whitespace-nowrap xl:border-b border-twitterBorder flex items-center no-scrollbar">
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          tab={tab}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ))}
    </div>
  );
};

export default TabList;
