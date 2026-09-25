"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { resolveSkillLogo } from "@/lib/skill-logos";

export function SkillIcon({
  name,
  delay = 0,
  size = 36,
}: {
  name: string;
  icon?: string;
  delay?: number;
  size?: number;
}) {
  const logo = resolveSkillLogo(name);
  const box = { height: size, width: size };

  return (
    <span className="relative flex shrink-0 items-center justify-center" style={box}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={logo?.slug ?? "fallback"}
          aria-label={name}
          className="flex h-full w-full items-center justify-center"
          initial={{ opacity: 0, scale: 0.55, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 320, damping: 22, delay }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.src} alt="" className="object-contain" style={box} />
          ) : (
            <span className="flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600" style={box}>
              <Code2 size={Math.max(14, Math.round(size * 0.42))} aria-hidden />
            </span>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
