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
                  {category.skills.map((skill) => (
                    <li
                      key={skill.id}
                      className="flex items-center gap-2 rounded-2xl border border-stone-100 bg-stone-50 py-1.5 pr-3 pl-1.5"
                    >
                      <SkillIcon icon={skill.icon} name={skill.name} />
                      <span className="text-sm text-stone-700">{skill.name}</span>
                    </li>
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
