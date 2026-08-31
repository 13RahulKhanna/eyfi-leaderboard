"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function useCountUp(target: number, durationSec = 0.8): number {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = prevTarget.current;
    if (from === target) return;
    const controls = animate(from, target, {
      duration: durationSec,
      ease: "easeOut",
      onUpdate: (v) => setValue(v),
    });
    prevTarget.current = target;
    return () => controls.stop();
  }, [target, durationSec]);

  return value;
}
