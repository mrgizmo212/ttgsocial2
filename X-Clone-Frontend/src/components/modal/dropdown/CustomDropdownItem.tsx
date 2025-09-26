import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

type CustomDropdownItemProps = {
  handleDropdownMutation: () => void;
  children: ReactNode;
  text: string;
  customClassName: string;
};

export function CustomDropdownItem({
  handleDropdownMutation,
  text,
  children,
  customClassName,
}: CustomDropdownItemProps) {
  return (
    <DropdownMenu.Item
      onClick={(e) => {
        e.stopPropagation();
        handleDropdownMutation();
      }}
      className={`px-3 py-2 ${customClassName} text-sm focus:outline-none focus-visible:outline-none items-center gap-2 flex hover:bg-twitterTextAlt/20 rounded cursor-pointer`}
    >
      {children}
      {text}
    </DropdownMenu.Item>
  );
}
