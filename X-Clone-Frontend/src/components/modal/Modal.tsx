import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  backdropMotionProps,
  modalMotionProps,
} from "../../animations/motionAnimations.ts";
import type { ModalType } from "../../types/ModalType.ts";

type ModalProps = {
  children: ReactNode;
  setToggle: (type: ModalType) => void;
  center?: boolean;
};

function Modal({ children, setToggle, center }: ModalProps) {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <motion.div
      key="backdrop"
      className={`w-dvw z-10 h-dvh max-h-dvh top-0 px-4 fixed backdrop-blur-sm flex justify-center ${
        center ? "items-center" : "items-start pt-16 "
      } bg-black/40`}
      {...backdropMotionProps}
      onClick={() => setToggle(null)}
    >
      <motion.div
        key="modal"
        className="w-full max-h-dvh md:w-1/3"
        {...modalMotionProps}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    modalRoot
  );
}

export default Modal;
