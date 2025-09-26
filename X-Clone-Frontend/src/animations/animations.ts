import type { Variants } from "framer-motion";

export const fadeInUpLong: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const backdropVariant: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalVariant: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3 },
  },
};
