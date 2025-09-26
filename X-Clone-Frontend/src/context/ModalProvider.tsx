import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ModalType } from "../types/ModalType";
import type { PostMedia } from "../types/PostMedia";

type ModalContextType = {
  modalType: ModalType;
  setModalType: (type: ModalType) => void;
  modalData: ModalData | null;
  setModalData: (modalData: ModalData) => void;
};

type ModalData = {
  mainId?: number;
  auxiliaryId?: PostMedia[];
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  return (
    <ModalContext.Provider
      value={{ modalType, setModalType, modalData, setModalData }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
