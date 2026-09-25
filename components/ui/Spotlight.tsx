"use client";

import { useMotionValue, useSpring, motion } from "framer-motion";
import { useRef } from "react";

export function Spotlight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
  }

  return (
    <div ref={ref} onMouseMove={onMove} className="relative overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/40 blur-3xl"
        style={{ left: springX, top: springY }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
