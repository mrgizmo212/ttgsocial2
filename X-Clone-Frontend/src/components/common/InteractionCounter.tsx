import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type InteractionCounterProps = {
  count: number;
};

export function InteractionCounter({ count }: InteractionCounterProps) {
  const [prevCount, setPrevCount] = useState(count);
  const [move, setMove] = useState(0);

  useEffect(() => {
    const diff = count > prevCount ? -15 : 15;
    setMove(diff);
    setPrevCount(count);
  }, [count]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={count}
        initial={{ y: move, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -move, opacity: 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 40 }}
        className="block text-sm"
      >
        {count}
      </motion.span>
    </AnimatePresence>
  );
}
