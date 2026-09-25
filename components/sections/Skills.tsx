"use client";

import { motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillIcon } from "@/components/ui/SkillIcon";
import type { Skill, SkillsContent } from "@/types/content";

const WASHES = [
  "from-emerald-400/80 via-lime-200/35 to-transparent",
  "from-sky-400/80 via-indigo-200/40 to-transparent",
  "from-amber-400/80 via-orange-200/35 to-transparent",
  "from-violet-400/75 via-fuchsia-200/30 to-transparent",
  "from-rose-400/70 via-orange-200/30 to-transparent",
];

type Tile = Skill & { categoryId: string; categoryName: string; wash: string };

export function Skills({ skills }: { skills: SkillsContent }) {
  const [active, setActive] = useState("all");

  const tiles = useMemo<Tile[]>(
    () =>
      skills.categories.flatMap((category, index) =>
        category.skills.map((skill) => ({
          ...skill,
          categoryId: category.id,
          categoryName: category.name,
          wash: WASHES[index % WASHES.length],
        })),
      ),
    [skills.categories],
  );

  const visible = active === "all" ? tiles : tiles.filter((tile) => tile.categoryId === active);

  return (
    <section id="skills" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading title={skills.heading} subtitle={skills.subheading} />
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
            <FilterChip active={active === "all"} onClick={() => setActive("all")}>
              All
            </FilterChip>
            {skills.categories.map((category) => (
              <FilterChip key={category.id} active={active === category.id} onClick={() => setActive(category.id)}>
                {category.name}
              </FilterChip>
            ))}
          </div>
        </Reveal>

        <motion.ul
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
            {visible.map((skill, index) => (
              <li
                key={skill.id}
                className="group relative overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <span className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${skill.wash}`} />
                <span className="relative mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 transition duration-200 group-hover:scale-105">
                  <SkillIcon name={skill.name} icon={skill.icon} size={44} delay={Math.min(index * 0.03, 0.2)} />
                </span>
                <p className="relative mt-4 text-center text-sm font-medium leading-snug text-stone-900">{skill.name}</p>
                <p className="relative mt-1 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {skill.categoryName}
                </p>
              </li>
            ))}
        </motion.ul>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        active
          ? "bg-stone-900 text-white shadow-sm"
          : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
      }`}
    >
      {children}
    </button>
  );
}
