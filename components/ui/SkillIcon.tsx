"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { resolveSkillLogo } from "@/lib/skill-logos";

export function SkillIcon({
  name,
  delay = 0,
}: {
  name: string;
  icon?: string;
  delay?: number;
}) {
  const logo = resolveSkillLogo(name);

  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
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
            <img src={logo.src} alt="" className="h-9 w-9 object-contain" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Code2 size={16} aria-hidden />
            </span>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
