import type { ReactNode } from "react";

type AsideContainerProps = {
  children: ReactNode;
  disabled?: boolean;
};

export function AsideContainer({ children, disabled }: AsideContainerProps) {
  return (
    <div
      className={`w-full border text-twitterText flex flex-col p-4 ${
        disabled ? "hover:cursor-not-allowed" : ""
      } border-twitterBorder rounded-xl`}
    >
      {children}
    </div>
  );
}
