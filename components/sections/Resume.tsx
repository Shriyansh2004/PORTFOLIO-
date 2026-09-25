import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ResumeContent } from "@/types/content";

export function Resume({ resume }: { resume: ResumeContent }) {
  const hasFile = resume.file.trim().length > 0;
  return (
    <section id="resume" className="scroll-mt-20 border-t border-stone-200/80">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading title={resume.heading} subtitle={resume.subheading} />
          <div className="mt-8">
            {hasFile ? (
              <a
                href={resume.file}
                download
                className="inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
              >
                {resume.buttonLabel}
              </a>
            ) : (
              <p className="text-sm text-stone-500">{resume.emptyLabel}</p>
            )}
            {hasFile && resume.showPreview ? (
              <iframe
                title={resume.fileName || resume.heading}
                src={resume.file}
                className="mt-6 h-[640px] w-full rounded-3xl border border-stone-200 bg-white shadow-sm"
              />
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
