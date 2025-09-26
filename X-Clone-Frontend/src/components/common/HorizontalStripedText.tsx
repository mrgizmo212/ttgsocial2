import type { ReactNode } from "react";

type HorizontalStripedTextProps = {
  children: ReactNode;
};

export function HorizontalStripedText({
  children,
}: HorizontalStripedTextProps) {
  return (
    <div className="w-full flex items-center text-twitterBorder">
      <div className="w-full">
        <hr />
      </div>
      <p className="text-twitterTextAlt px-2">{children}</p>
      <div className="w-full">
        <hr />
      </div>
    </div>
  );
}
