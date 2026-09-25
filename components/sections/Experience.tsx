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
          <ol className="relative mt-12 space-y-6 border-l border-indigo-100 pl-8">
            {entries.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[39px] top-6 h-3 w-3 rounded-full border-2 border-white bg-indigo-500 shadow" />
                <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    {entry.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.logo} alt={entry.logoAlt} className="h-12 w-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-semibold text-indigo-700">
                        {entry.company.slice(0, 1)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-stone-900">{entry.role}</h3>
                      <p className="text-sm text-stone-600">{entry.company}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-indigo-600">{entry.duration}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">{entry.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {entry.tech.map((item) => (
                      <li key={item} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
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
