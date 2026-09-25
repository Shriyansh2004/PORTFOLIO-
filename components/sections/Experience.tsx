import { ExperiencePicker } from "@/components/sections/ExperiencePicker";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sortByOrder } from "@/lib/reorder";
import type { CertificationsContent, ExperienceContent } from "@/types/content";

export function Experience({
  experience,
  certifications,
}: {
  experience: ExperienceContent;
  certifications: CertificationsContent;
}) {
  const entries = sortByOrder(experience.entries);
  const certs = sortByOrder(certifications.entries);

  return (
    <section id="experience" className="scroll-mt-20 border-t border-stone-200/80">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading title={experience.heading} subtitle={experience.subheading} />
          <ExperiencePicker entries={entries} />
          <div className="mt-10">
            <h3 className="font-serif text-2xl text-stone-900">{certifications.heading}</h3>
            <p className="mt-2 text-sm text-stone-500">{certifications.subheading}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {certs.map((item) => (
                <li key={item.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="text-sm font-medium text-stone-900">{item.title}</p>
                  <p className="text-sm text-stone-600">{item.issuer}</p>
                  <p className="mt-2 text-sm text-stone-700">{item.detail}</p>
                  {item.year ? <p className="mt-1 text-xs text-indigo-600">{item.year}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
