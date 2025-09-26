import { createContext, useState } from "react";
import type { ReactNode } from "react";

export const HeaderContentContext = createContext<{
  headerContent: ReactNode;
  setHeaderContent: (content: ReactNode) => void;
}>({
  headerContent: null,
  setHeaderContent: () => {},
});

export function HeaderContentProvider({ children }: { children: ReactNode }) {
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);
  return (
    <HeaderContentContext.Provider value={{ headerContent, setHeaderContent }}>
      {children}
    </HeaderContentContext.Provider>
  );
}
