import type { HTMLMotionProps } from "framer-motion";
import { fadeInUpLong } from "./animations.ts";
import { backdropVariant, modalVariant } from "./animations.ts";

export const fadeInFeedMotionProps: HTMLMotionProps<"div"> = {
  variants: fadeInUpLong,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  layout: true,
};

export const backdropMotionProps: HTMLMotionProps<"div"> = {
  variants: backdropVariant,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

export const modalMotionProps: HTMLMotionProps<"div"> = {
  variants: modalVariant,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};
