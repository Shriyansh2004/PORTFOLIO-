"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillIcon } from "@/components/ui/SkillIcon";
import type { SkillsContent } from "@/types/content";

const SPANS = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-1", "md:col-span-2"];

export function Skills({ skills }: { skills: SkillsContent }) {
  return (
    <section id="skills" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading title={skills.heading} subtitle={skills.subheading} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {skills.categories.map((category, index) => (
              <article
                key={category.id}
                className={`rounded-3xl border border-stone-200 bg-white p-6 shadow-sm ${SPANS[index % SPANS.length]}`}
              >
                <h3 className="text-sm font-semibold text-stone-900">{category.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.li
                      key={skill.id}
                      className="flex items-center gap-2 rounded-2xl border border-stone-100 bg-stone-50 py-1.5 pr-3 pl-1.5"
                      initial={{ opacity: 0, y: 10, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22, delay: skillIndex * 0.06 }}
                      whileHover={{ y: -3, scale: 1.03 }}
                    >
                      <SkillIcon icon={skill.icon} name={skill.name} delay={skillIndex * 0.05} />
                      <span className="text-sm text-stone-700">{skill.name}</span>
                    </motion.li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
