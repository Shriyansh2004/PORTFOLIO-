import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/types/content";

export function About({ profile }: { profile: Profile }) {
  const about = profile.about;
  return (
    <section id="about" className="scroll-mt-20 border-t border-stone-200/80">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading title={about.heading} subtitle={about.subheading} />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
              <p className="text-base leading-relaxed text-stone-600">{about.bio}</p>
              <ul className="mt-6 space-y-3">
                {about.highlights.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm leading-relaxed text-stone-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-400">
                {about.educationHeading}
              </h3>
              <ul className="mt-4 space-y-4">
                {about.education.map((item) => (
                  <li key={item.id} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-indigo-600">{item.year}</p>
                    <p className="mt-1 font-medium text-stone-900">{item.degree}</p>
                    <p className="mt-1 text-sm text-stone-600">{item.school}</p>
                    {item.detail ? <p className="mt-2 text-sm text-stone-500">{item.detail}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
